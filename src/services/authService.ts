import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'client';
  };
}

class AuthService {
  async register(registerData: RegisterData): Promise<LoginResponse> {
    try {
      await api.post('/cliente', {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password
      });
      
      const loginResponse = await this.login({
        email: registerData.email,
        password: registerData.password
      });
      
      return loginResponse;
    } catch {
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  }

  async login(loginData: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post('/login', loginData);
      
      const token = response.headers['token'];
      const refreshToken = response.headers['refresh_token'];
      
      if (!token) {
        throw new Error('Token não recebido');
      }
      
      const user = {
        id: Date.now().toString(),
        email: loginData.email,
        name: loginData.email.split('@')[0], 
        role: loginData.email.includes('admin') ? 'admin' as const : 'client' as const
      };
      
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, user };
    } catch {
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.get('/logout');
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export default new AuthService();