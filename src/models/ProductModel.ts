import api from '../services/api';
import { Product } from '../types/Products';

export const ProductModel = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>('/produto');
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.warn('API retornou dados que não são um array:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Não foi possível carregar os produtos. Verifique se o servidor está rodando.');
    }
  },

  getById: async (id: string): Promise<Product | null> => {
    try {
      const response = await api.get<Product>(`/produto/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return null;
    }
  },

  create: async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    try {
      const response = await api.post<Product>('/produto', productData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  update: async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const response = await api.put<Product>(`/produto/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/produto/${id}`);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      throw error;
    }
  }
};