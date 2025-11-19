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
  cpf: string;
  phoneNumber: string;
  street: string;
  number: string;
  block: string;
  city: string;
  state: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'client';
  };
}

class AuthService {
  async register(registerData: RegisterData): Promise<void> {
    try {
      const nameParts = registerData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const clientData = {
        firstName,
        lastName,
        cpf: registerData.cpf,
        phoneNumber: registerData.phoneNumber,
        email: registerData.email,
        password: registerData.password,
        activeStatus: true,
        adress: {
          street: registerData.street,
          number: registerData.number,
          block: registerData.block,
          city: registerData.city,
          state: registerData.state
        }
      };
      
      const clientResponse = await api.post('/cliente', clientData);
      console.log('Cliente cadastrado com sucesso!', clientResponse.data);
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw new Error('Erro ao criar conta. Tente novamente.');
    }
  }

  async login(loginData: LoginData): Promise<LoginResponse> {
    try {
      const response = await api.post('/login', loginData);
      
      // Backend agora retorna tokens no body
      let token = response.data?.token;
      let refreshToken = response.data?.refreshToken;
      
      // Fallback: tentar dos headers se não vier no body
      if (!token) {
        token = response.headers['token'];
        refreshToken = response.headers['refresh_token'];
      }
      
      console.log('✅ Login response:', response.data);
      console.log('✅ Token:', token);
      console.log('✅ RefreshToken:', refreshToken);
      
      if (!token) {
        throw new Error('Token não recebido do servidor.');
      }
      
      let user;
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          throw new Error('Token inválido');
        }
        
        const payloadBase64 = tokenParts[1];
        const payloadDecoded = atob(payloadBase64);
        const payload = JSON.parse(payloadDecoded);
        
        console.log('Payload decodificado do token:', payload);
        
        user = {
          id: payload?.id || Date.now().toString(),
          email: payload?.email || loginData.email,
          name: payload?.userName && payload.userName !== 'undefined undefined' 
            ? payload.userName 
            : (payload?.email ? payload.email.split('@')[0] : 'Usuário'),
          role: loginData.email.includes('admin') ? 'admin' as const : 'client' as const
        };
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        user = {
          id: Date.now().toString(),
          email: loginData.email,
          name: loginData.email.split('@')[0],
          role: loginData.email.includes('admin') ? 'admin' as const : 'client' as const
        };
      }
      
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return { token, refreshToken, user };
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
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

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      const response = await api.post('/refresh-token', {
        refreshToken: refreshToken
      });

      const newToken = response.data.token;
      const newRefreshToken = response.data.refreshToken;

      if (newToken) {
        localStorage.setItem('accessToken', newToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.logout();
      return false;
    }
  }
}

export default new AuthService();