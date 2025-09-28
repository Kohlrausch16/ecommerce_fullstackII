export interface Cart {
  id: string;
  totalOrder: number;
  activeStatus: boolean;
  cartItemId: string[] | CartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  productQtd: number;
  totalAmount: number;
  activeStatus: boolean;
  productId: string | Product;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
}

export interface CreateCartData {
  totalOrder: number;
  activeStatus?: boolean;
  cartItemId?: string[];
}

export interface UpdateCartData {
  totalOrder?: number;
  activeStatus?: boolean;
  cartItemId?: string[];
}

export interface CreateCartItemData {
  productQtd: number;
  totalAmount: number;
  activeStatus?: boolean;
  productId: string;
}

export interface UpdateCartItemData {
  productQtd?: number;
  totalAmount?: number;
  activeStatus?: boolean;
  productId?: string;
}

export interface CartWithItems extends Cart {
  items: CartItem[];
}