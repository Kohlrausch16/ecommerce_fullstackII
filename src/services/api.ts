  import axios from "axios";

  const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10000,
  });

  // Intercepta requests e injeta token (se existir no localStorage)
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export default api;
