export interface Product {
  id: string;
  name: string;
  price: number;
  height: number;
  width: number;
  length: number;
  color: string[];
  description: string;
  year?: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}