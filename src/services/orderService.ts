import api from "./api";
import { Order, CreateOrderData, MonthlyReport, MostSoldProduct, LowStockProduct } from "../types/Order";

class OrderService {
  async getOrders(): Promise<Order[]> {
    try {
      const response = await api.get<Order[]>("/pedido");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      throw new Error("Não foi possível buscar os pedidos");
    }
  }

  async createOrder(cartId: string): Promise<string> {
    try {
      const response = await api.post<{ message: string }>("/pedido", { cartId });
      return response.data.message;
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      throw new Error("Não foi possível criar o pedido");
    }
  }

  async getMonthlyReport(initial: string, final: string): Promise<MonthlyReport> {
    try {
      const response = await api.get<MonthlyReport>(`/pedido/mensal?initial=${initial}&final=${final}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar relatório mensal:", error);
      throw new Error("Não foi possível buscar o relatório mensal");
    }
  }

  async getMostSoldProduct(): Promise<MostSoldProduct> {
    try {
      const response = await api.get<MostSoldProduct>("/pedido/venda");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produto mais vendido:", error);
      throw new Error("Não foi possível buscar o produto mais vendido");
    }
  }

  async getLowStockProducts(): Promise<LowStockProduct> {
    try {
      const response = await api.get<LowStockProduct>("/produto/estoque");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar produtos com baixo estoque:", error);
      throw new Error("Não foi possível buscar produtos com baixo estoque");
    }
  }
}

export default new OrderService();
