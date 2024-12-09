// Settings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { login, logout, verifyToken } from './components/auth';

const Settings = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            if (!response) {
                setSuccessMessage('Login success');
                setErrorMessage('');
            } else {
                setErrorMessage('Login failed: ' + response);
                setSuccessMessage('');
            }
        } catch (error) {
            setErrorMessage('Login failed: ' + error.message);
            setSuccessMessage('');
        }
    };

    useEffect(() => {
        verifyToken().then((isLogin) => {
            if (isLogin) {
                setToken(localStorage.getItem('token'));
            }
        });
    }
        , []);

    return (
        <div>
            <div className="panel">
                <h2>{token
                    ? 'Already logined.You can login again to ref token.' 
                    : 'Need login first.'
                    }</h2>
                <div>
                    <label>Username:</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className='button' onClick={handleLogin}>
                    Login
                </button>
            </div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
};

export default Settings;