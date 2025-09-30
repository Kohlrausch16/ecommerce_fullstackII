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

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    try {
      const response = await api.put(`/cliente/${id}`, clientData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
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
      console.log('=== DEBUG CLIENTE CART ===');
      console.log('User data do localStorage:', userData);
      
      if (userData) {
        const user = JSON.parse(userData);
        console.log('User parseado:', user);
        console.log('ID do usuário:', user.id);
        
        if (user.id) {
          const client = await this.getClientById(user.id);
          console.log('Dados completos do cliente:', client);
          console.log('CartId do cliente:', client.cartId);
        }
      }
      console.log('=== FIM DEBUG ===');
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