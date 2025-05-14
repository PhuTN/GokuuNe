import axios from 'axios';
import config from './config';

const api = axios.create({
    baseURL: config.API_URL,
    timeout: config.TIMEOUT,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm interceptor nếu cần
api.interceptors.request.use(
    async (request) => {
        // const token = await AsyncStorage.getItem('accessToken');
        // if (token) request.headers.Authorization = `Bearer ${token}`;
        return request;
    },
    error => Promise.reject(error)
);

export default api;
