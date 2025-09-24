import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const token = response.headers['token'];
    const refreshToken = response.headers['refresh_token'];
    
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    return response;
  },
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
