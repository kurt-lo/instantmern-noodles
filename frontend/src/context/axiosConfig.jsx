import axios from 'axios';

const instance = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authUserToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // config.headers.Authorization = `${token}`;
    }
    // console.log('Request Headers:', config.headers);
    return config;
});

export default instance;