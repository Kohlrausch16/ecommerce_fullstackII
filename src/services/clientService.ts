import api from './api';

export interface Client {
  id: string;
  name: string;
  email: string;
  password?: string;
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
}

export default new ClientService();