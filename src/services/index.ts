// Exportar todos os serviços relacionados ao carrinho
export { default as cartService } from './cartService';
export { default as cartItemService } from './cartItemService';
export { default as integratedCartService } from './integratedCartService';

// Exportar serviços de produtos, fornecedores e pedidos
export { default as supplierService } from './supplierService';
export { default as orderService } from './orderService';
export * from './productService';
export * from './authService';
export * from './clientService';

// Exportar tipos
export type {
  Cart,
  CartItem,
  CreateCartData,
  UpdateCartData,
  CreateCartItemData,
  UpdateCartItemData,
  CartWithItems
} from '../types/Cart';

export type {
  Supplier,
  CreateSupplierData,
  UpdateSupplierData
} from '../types/Supplier';

export type {
  Order,
  CreateOrderData,
  MonthlyReport,
  MostSoldProduct,
  LowStockProduct
} from '../types/Order';

export type {
  Product,
  ApiResponse
} from '../types/Products';