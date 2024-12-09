
// const serverUrl = 'http://localhost:3000';
import { serverUrl } from './api';
const authPath = serverUrl + '/auth/login';
const tokenKey = 'token';
import axios from 'axios';

export const verifyToken = async () => {
    const token = localStorage.getItem(tokenKey);
    console.log('token:', token);
    if (!token) return null;
    return token;
};

export const login = async (username, password) => {
    try {
        // console.log('url:', authPath + '?name=' + username + '&password=' + password);

        const response = await axios.post(authPath,
            {
                name: username,
                password,
            });
        // console.log('response:', response);
        const { token } = response.data;
        localStorage.setItem(tokenKey, token); // 存储 JWT

        return null;
    } catch (error) {
        // console.error('Login failed:', error.response);
        return error;
    }
};

export const logout = () => {
    const currentUrl = window.location.href;
    localStorage.removeItem(tokenKey);
    // redirect to login page immediately
}


