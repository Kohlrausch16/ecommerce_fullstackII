export interface Order {
  id: string;
  cartId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderData {
  cartId: string;
}

export interface MonthlyReport {
  totalSales: number;
  period: {
    initial: string;
    final: string;
  };
}

export interface MostSoldProduct {
  productId: string;
  productName: string;
  totalSold: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stockQtd: number;
  price: number;
}
