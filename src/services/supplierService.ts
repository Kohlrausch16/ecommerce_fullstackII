import api from "./api";
import { Supplier, CreateSupplierData, UpdateSupplierData } from "../types/Supplier";

class SupplierService {
  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await api.get<Supplier[]>("/fornecedor");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      throw new Error("Não foi possível buscar os fornecedores");
    }
  }

  async getSupplierById(id: string): Promise<Supplier> {
    try {
      const response = await api.get<Supplier>(`/fornecedor/${id}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error);
      throw new Error("Não foi possível buscar o fornecedor");
    }
  }

  async addSupplier(supplierData: CreateSupplierData): Promise<string> {
    try {
      const response = await api.post<{ message: string }>("/fornecedor", supplierData);
      return response.data.message;
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error);
      throw new Error("Não foi possível adicionar o fornecedor");
    }
  }

  async updateSupplier(id: string, supplierData: UpdateSupplierData): Promise<string> {
    try {
      const response = await api.put<{ message: string }>(`/fornecedor/${id}`, supplierData);
      return response.data.message;
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw new Error("Não foi possível atualizar o fornecedor");
    }
  }

  async deleteSupplier(id: string): Promise<string> {
    try {
      const response = await api.delete<{ message: string }>(`/fornecedor/${id}`);
      return response.data.message;
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      throw new Error("Não foi possível deletar o fornecedor");
    }
  }
}

export default new SupplierService();
