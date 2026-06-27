import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create the main api instance
const api = axios.create({
    baseURL: API_URL,
    headers: { 
        'Content-Type': 'application/json',
    },
});

// ✅ Create publicApi instance (for public routes without auth)
const publicApi = axios.create({
    baseURL: API_URL,
    headers: { 
        'Content-Type': 'application/json',
    },
});

// ✅ Request interceptor for api (with auth)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (token) {
            config.headers['x-auth-token'] = token;
        } else if (user && user.email) {
            config.headers['x-auth-token'] = user.email;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for api
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ✅ Export both api and publicApi
export { publicApi };
export default api;