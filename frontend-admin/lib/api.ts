import axios from 'axios';

const getBaseUrl = () => {
    const host = process.env.NEXT_PUBLIC_API_HOST;
    if (host) return `https://${host}/api`;
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const admin = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;
        if (admin) {
            const { token } = JSON.parse(admin);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
