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
        const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (user) {
            const { token } = JSON.parse(user);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        // Add Accept-Language header based on user's selected locale
        const locale = typeof window !== 'undefined' ? localStorage.getItem('locale') : null;
        if (locale) {
            config.headers['Accept-Language'] = locale;
        } else {
            config.headers['Accept-Language'] = 'en'; // Default to English
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
