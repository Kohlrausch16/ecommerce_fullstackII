import api from '../services/api';
import { Product } from '../types/Products';

export const ProductModel = {
  getAll: async (): Promise<Product[]> => {
    try {
      const response = await api.get<Product[]>('/produto');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return [];
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
  }
};