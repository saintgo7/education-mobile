import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),

  register: (userData) =>
    apiClient.post('/auth/register', userData),

  forgotPassword: (email) =>
    apiClient.post('/auth/forgot-password', { email }),
};

export const userAPI = {
  getProfile: () =>
    apiClient.get('/user/profile'),

  updateProfile: (profileData) =>
    apiClient.put('/user/profile', profileData),

  uploadAvatar: (formData) =>
    apiClient.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const productsAPI = {
  getAll: () =>
    apiClient.get('/products'),

  getById: (id) =>
    apiClient.get(`/products/${id}`),

  search: (query) =>
    apiClient.get(`/products/search?q=${query}`),

  getCategories: () =>
    apiClient.get('/products/categories'),
};

export default apiClient;
