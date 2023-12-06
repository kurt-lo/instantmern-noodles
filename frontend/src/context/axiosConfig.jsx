import axios from 'axios';

const instance = axios.create({
    baseURL: '',
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authUserToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request Headers:', config.headers);
    return config;
});

export default instance;