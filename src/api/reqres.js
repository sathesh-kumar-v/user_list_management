import axios from 'axios';

// This will now correctly pick up 'reqres-free-v1'
const API_KEY = process.env.REACT_APP_REQRES_API_KEY;

const API_BASE_URL = 'https://reqres.in/api';

const reqresApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // This part correctly adds the x-api-key header
    ...(API_KEY && { 'x-api-key': API_KEY })
  },
});

export const authApi = {
  login: (email, password) => reqresApi.post('/login', { email, password }),
};

export const usersApi = {
  getUsers: (page = 1) => reqresApi.get(`/users?page=${page}`),
  getUser: (id) => reqresApi.get(`/users/${id}`),
  createUser: (userData) => reqresApi.post('/users', userData),
  updateUser: (id, userData) => reqresApi.put(`/users/${id}`, userData),
  deleteUser: (id) => reqresApi.delete(`/users/${id}`),
};

reqresApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);