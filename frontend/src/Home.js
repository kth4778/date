import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 기본 캘린더 스타일
import './Home.css'; // 커스텀 스타일
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

function Home() {
    const location = useLocation();
    const { username } = location.state || { username: 'Guest' };

    const [julyDates, setJulyDates] = useState([]);
    const [augustDates, setAugustDates] = useState([]);
    const [allSelections, setAllSelections] = useState([]);

    useEffect(() => {
        // Fetch initial data
        fetch(`${API_URL}/selections`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setAllSelections(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                    setAllSelections([]); // 배열이 아니면 빈 배열로 초기화
                }
            });

        // WebSocket connection
        const wsUrl = API_URL.replace('/api', '/ws'); // API_URL에서 /api를 /ws로 변경
        const socket = new SockJS(wsUrl);
        const stompClient = Stomp.over(socket);

        stompClient.connect({}, () => {
            stompClient.subscribe('/topic/selections', (message) => {
                const parsedMessage = JSON.parse(message.body);
                if (Array.isArray(parsedMessage)) {
                    setAllSelections(parsedMessage);
                } else {
                    console.error('WebSocket message is not an array:', parsedMessage);
                    setAllSelections([]); // 배열이 아니면 빈 배열로 초기화
                }
            });
        });

        return () => {
            if (stompClient.connected) {
                stompClient.disconnect();
            }
        };
    }, []);

    const handleDateClick = (date, month) => {
        const dateString = date.toISOString().split('T')[0];
        const setter = month === 'july' ? setJulyDates : setAugustDates;
        const list = month === 'july' ? julyDates : augustDates;

        if (list.includes(dateString)) {
            setter(list.filter(d => d !== dateString));
        } else {
            setter([...list, dateString]);
        }
    };

    

    const handleSubmit = () => {
        const selectedDates = [...julyDates, ...augustDates];
        if (selectedDates.length === 0) {
            alert('날짜를 선택해주세요.');
            return;
        }

        // 이미 백엔드에 저장된 날짜를 제외하고, 새로 추가할 날짜만 필터링
        const newDatesToAdd = selectedDates.filter(dateString => {
            return !allSelections.some(s => s.username === username && s.selectedDate === dateString);
        });

        if (newDatesToAdd.length === 0) {
            alert('새로 추가할 날짜가 없습니다.');
            return;
        }

        fetch(`${API_URL}/selections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, dates: newDatesToAdd })
        }).then(response => {
            if (!response.ok) {
                // 백엔드에서 오류 응답을 보낸 경우 (예: 중복된 날짜 추가 시도)
                return response.text().then(text => { throw new Error(text) });
            }
            return;
        }).then(() => {
            setJulyDates([]);
            setAugustDates([]);
            window.location.reload(); // 페이지 새로고침
        }).catch(error => {
            console.error('Error saving selections:', error);
            alert(`날짜 저장 중 오류가 발생했습니다: ${error.message}`);
        });
    };

    const handleDelete = async () => {
        const datesToDelete = [...julyDates, ...augustDates];

        if (datesToDelete.length === 0) {
            alert('삭제할 날짜를 선택해주세요.');
            return;
        }

        if (!window.confirm(`선택된 ${datesToDelete.length}개의 날짜를 삭제하시겠습니까?`)) {
            return;
        }

        try {
            for (const dateString of datesToDelete) {
                await fetch(`${API_URL}/selections/${username}/${dateString}`, {
                    method: 'DELETE',
                });
            }
            setJulyDates([]);
            setAugustDates([]);
            window.location.reload(); // 페이지 새로고침
        } catch (error) {
            console.error('Error deleting selected dates:', error);
            alert('선택 날짜 삭제 중 오류가 발생했습니다.');
        }
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            const usersOnDate = allSelections.filter(s => s.selectedDate === dateString);
            if (usersOnDate.length > 0) {
                return (
                    <div className="name-list">
                        {usersOnDate.map((u, index) => (
                            <div key={index} className="name-item">{u.username}</div>
                        ))}
                    </div>
                );
            }
        }
        return null;
    };

    const tileClassName = ({ date, view, month }) => {
        if (view === 'month') {
            const dateString = date.toISOString().split('T')[0];
            const list = date.getMonth() === 6 ? julyDates : augustDates;
            if (list.includes(dateString)) {
                return 'selected-date';
            }
        }
        return null;
    };

    return (
        <div className="home-container">
            <h1>{username}님, 여행 못가는 날짜를 선택해주세요.</h1>
            <div className="calendars-container">
                <div className="calendar-wrapper">
                    <h2>7월</h2>
                    <Calendar
                        activeStartDate={new Date(2025, 6, 1)}
                        onClickDay={(date) => handleDateClick(date, 'july')}
                        tileContent={tileContent}
                        tileClassName={(props) => tileClassName({ ...props, month: 'july' })}
                        formatDay={(locale, date) => date.getDate()}
                        showNeighboringMonth={false}
                    />
                </div>
                <div className="calendar-wrapper">
                    <h2>8월</h2>
                    <Calendar
                        activeStartDate={new Date(2025, 7, 1)}
                        onClickDay={(date) => handleDateClick(date, 'august')}
                        tileContent={tileContent}
                        tileClassName={(props) => tileClassName({ ...props, month: 'august' })}
                        formatDay={(locale, date) => date.getDate()}
                        showNeighboringMonth={false}
                    />
                </div>
            </div>
            <button className="submit-button" onClick={handleSubmit}>완료</button>
            <button className="delete-button" onClick={handleDelete}>선택 날짜 삭제</button>
        </div>
    );
}

export default Home;