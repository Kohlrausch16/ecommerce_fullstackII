import api from './api';

export interface Client {
  id: string;
  name: string;
  email: string;
  password?: string;
  cartId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateClientData {
  firstName: string;
  lastName: string;
  cpf: string;
  phoneNumber: string;
  email: string;
  password: string;
  activeStatus: boolean;
  adress: {
    street: string;
    number: string;
    block: string;
    city: string;
    state: string;
  };
}

export interface CreateClientData {
  name: string;
  email: string;
  password: string;
}

class ClientService {
  async getClients(): Promise<Client[]> {
    try {
      const response = await api.get('/cliente');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  async getClientById(id: string): Promise<Client> {
    try {
      const response = await api.get(`/cliente/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  async createClient(clientData: CreateClientData): Promise<Client> {
    try {
      const response = await api.post('/cliente', clientData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  async updateClient(id: string, clientData: Partial<UpdateClientData>): Promise<Client> {
    try {
      const response = await api.put(`/cliente/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  async updateProfile(id: string, clientData: Partial<UpdateClientData>): Promise<Client> {
    try {
      
      // Verificar tokens
      const token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      const response = await api.put(`/cliente/${id}`, clientData);
      
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  }

  async deleteClient(id: string): Promise<void> {
    try {
      await api.delete(`/cliente/${id}`);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }

  async getClientCartId(clientId: string): Promise<string | null> {
    try {
      const client = await this.getClientById(clientId);
      return client.cartId || null;
    } catch (error) {
      console.error('Erro ao buscar cartId do cliente:', error);
      return null;
    }
  }

  async getLoggedClientData(): Promise<Client | null> {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        return null;
      }

      const user = JSON.parse(userData);
      if (!user.id) {
        return null;
      }

      return await this.getClientById(user.id);
    } catch (error) {
      console.error('Erro ao buscar dados do cliente logado:', error);
      return null;
    }
  }

  async debugClientCart(): Promise<void> {
    try {
      const userData = localStorage.getItem('user');

      
      if (userData) {
        const user = JSON.parse(userData);
        
        if (user.id) {
          const client = await this.getClientById(user.id);
        }
      }
    } catch (error) {
      console.error('Erro no debug:', error);
    }
  }
}

const clientService = new ClientService();

if (typeof window !== 'undefined') {
  (window as any).debugClientCart = () => clientService.debugClientCart();
}

export default clientService;