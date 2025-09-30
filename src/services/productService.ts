import api from "./api";
import { Product } from "../types/Products";

export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>("/produto");
  // console.log("Resposta da API:", response.data);
  return response.data;
};


export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/produto/${id}`);
  return response.data;
};

export const addProduct = async (product: Product): Promise<string> => {
  const response = await api.post<{ message: string }>("/produto", product);
  return response.data.message;
};

export const updateProduct = async (id: string, product: Product): Promise<string> => {
  const response = await api.put<{ message: string }>(`/produto/${id}`, product);
  return response.data.message;
};

export const deleteProduct = async (id: string): Promise<string> => {
  const response = await api.delete<{ message: string }>(`/produto/${id}`);
  return response.data.message;
};
