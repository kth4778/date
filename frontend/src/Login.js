import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleStart = () => {
        if (username.trim() === '') {
            alert('이름을 입력해주세요.');
            return;
        }
        navigate('/home', { state: { username } });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>어디로 떠나볼까요?</h1>
                <p>당신의 이름을 알려주세요.</p>
                <input
                    type="text"
                    className="username-input"
                    placeholder="이름을 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleStart()}
                />
                <button className="start-button" onClick={handleStart}>
                    여행 시작하기
                </button>
            </div>
        </div>
    );
}

export default Login;
