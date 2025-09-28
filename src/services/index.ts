// Exportar todos os serviços relacionados ao carrinho
export { default as cartService } from './cartService';
export { default as cartItemService } from './cartItemService';
export { default as integratedCartService } from './integratedCartService';

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