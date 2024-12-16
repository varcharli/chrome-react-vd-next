import axios from 'axios';
import { logout, verifyToken } from './auth';

export const serverUrl = 'http://192.168.0.75:3000';
const authPath = serverUrl + '/auth/login';
const apiPath = serverUrl + '/scraper';
const tokenKey = 'token';

const api = axios.create({
    baseURL: apiPath, 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(tokenKey);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// api.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response && error.response.status === 401) {
//             // 401
//             // alert('Session expired. Please log in again.');
//             logout();
//         }
//         return error;
//     }
// );

const createMovie = async (data) => {
    const token = await verifyToken();
    if (!token) {
        throw new Error('Please login first');
    }
    const response = await api.post('/movies', data);
    return response;
};
api.createMovie = createMovie;






export default api;

