import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if (username === '' || username === 'default') {
            alert('이름을 선택해주세요.');
            return;
        }
        navigate('/home', { state: { username } });
    };

    const names = ['원태', '운태', '희성', '현식', '준태', '동현', '래현', '민기', '병현', '상민', '상준', '제준', '진홍', '준엽'];

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>어디로 떠나볼까요?</h1>
                <p>당신의 이름을 선택해주세요.</p>
                <select
                    className="username-select"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                >
                    <option value="default">이름 선택</option>
                    {names.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
                <button className="start-button" onClick={handleStart}>
                    여행 시작하기
                </button>
            </div>
        </div>
    );
}

export default Login;
