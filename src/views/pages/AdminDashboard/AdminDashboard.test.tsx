//import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import AdminDashboard from "./AdminDashboard";
import orderService from "../../../services/orderService";



// serviços mockados
jest.mock("../../../services/orderService", () => ({
  getMonthlyReport: jest.fn(),
  getMostSoldProduct: jest.fn(),
  getLowStockProducts: jest.fn(),
}));



describe("AdminDashboard", () => {
  const mockMonthly = {
    totalSales: 1500.5,
  };

  const mockMostSold = {
    productName: "Notebook Gamer",
    totalSold: 45,
  };

  const mockLowStock = {
    name: "Mouse",
    stockQtd: 3,
    price: 59.9,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renderiza o estado de carregamento inicialmente", async () => {
    (orderService.getMonthlyReport as jest.Mock).mockResolvedValue(mockMonthly);
    (orderService.getMostSoldProduct as jest.Mock).mockResolvedValue(mockMostSold);
    (orderService.getLowStockProducts as jest.Mock).mockResolvedValue(mockLowStock);

    render(<AdminDashboard />);

    expect(screen.getByText("Carregando dashboard...")).toBeInTheDocument();

    await waitFor(() =>
      expect(orderService.getMonthlyReport).toHaveBeenCalled()
    );
  });

  test("Carrega e exibe dados do dashboard corretamente", async () => {
    (orderService.getMonthlyReport as jest.Mock).mockResolvedValue(mockMonthly);
    (orderService.getMostSoldProduct as jest.Mock).mockResolvedValue(mockMostSold);
    (orderService.getLowStockProducts as jest.Mock).mockResolvedValue(mockLowStock);

    render(<AdminDashboard />);

    // Espera os dados serem renderizados
    await waitFor(() =>
      expect(screen.getByText("R$ 1.500,50")).toBeInTheDocument()
    );

    // Produto mais vendido
    expect(screen.getByText("Notebook Gamer")).toBeInTheDocument();
    expect(screen.getByText("45 unidades vendidas")).toBeInTheDocument();

    // Baixo estoque
    expect(screen.getByText("Mouse")).toBeInTheDocument();
    expect(screen.getByText(/3/i)).toBeInTheDocument();
  });

  test("Exibe mensagem de erro ao falhar no carregamento", async () => {
    (orderService.getMonthlyReport as jest.Mock).mockRejectedValue(new Error("erro"));
    (orderService.getMostSoldProduct as jest.Mock).mockResolvedValue(null);
    (orderService.getLowStockProducts as jest.Mock).mockResolvedValue(null);

    render(<AdminDashboard />);

    await waitFor(() =>
      expect(screen.getByText("Erro ao carregar dados do dashboard")).toBeInTheDocument()
    );
  });

  test("Atualiza o intervalo de datas ao editar inputs", async () => {
    (orderService.getMonthlyReport as jest.Mock).mockResolvedValue(mockMonthly);
    (orderService.getMostSoldProduct as jest.Mock).mockResolvedValue(mockMostSold);
    (orderService.getLowStockProducts as jest.Mock).mockResolvedValue(mockLowStock);

    render(<AdminDashboard />);

    const initialInput = screen.getByLabelText("Data Inicial") as HTMLInputElement;

    fireEvent.change(initialInput, { target: { value: "2025-01-01" } });

    expect(initialInput.value).toBe("2025-01-01");
  });

  test("Chama loadDashboardData ao clicar no botão Buscar", async () => {
    (orderService.getMonthlyReport as jest.Mock).mockResolvedValue(mockMonthly);
    (orderService.getMostSoldProduct as jest.Mock).mockResolvedValue(mockMostSold);
    (orderService.getLowStockProducts as jest.Mock).mockResolvedValue(mockLowStock);

    render(<AdminDashboard />);

    const button = screen.getByText("Buscar");

    fireEvent.click(button);

    await waitFor(() =>
      expect(orderService.getMonthlyReport).toHaveBeenCalledTimes(2)
    );
  });
});
