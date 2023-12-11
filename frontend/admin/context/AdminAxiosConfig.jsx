import axios from 'axios';

const instanceAdmin = axios.create({
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
    },
});

instanceAdmin.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem('authAdminToken');

    if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    }

    console.log('Request Headers:', config.headers);
    return config;
});

export default instanceAdmin;
