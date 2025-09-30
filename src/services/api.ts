import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['token'] = token;
  }
  
  if (refreshToken) {
    config.headers['refresh_token'] = refreshToken;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Se o token expirou (401) e ainda não tentamos renovar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          // Tenta renovar o token
          const refreshResponse = await axios.post('http://localhost:3000/refresh-token', {
            refreshToken: refreshToken
          });
          
          const newToken = refreshResponse.data.token;
          const newRefreshToken = refreshResponse.data.refreshToken;
          
          // Atualiza os tokens no localStorage
          localStorage.setItem('accessToken', newToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          // Atualiza os headers da requisição original
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers['token'] = newToken;
          if (newRefreshToken) {
            originalRequest.headers['refresh_token'] = newRefreshToken;
          }
          
          // Refaz a requisição original com o novo token
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
          // Se falhou ao renovar, faz logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } else {
        // Se não tem refresh token, faz logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Para outros erros de autenticação/autorização
    if (error.response?.status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

export default api;
