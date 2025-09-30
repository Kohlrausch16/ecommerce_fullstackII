import cartItemService from './cartItemService';
import realCartService from './realCartService';
import { Cart, CartItem, CartWithItems } from '../types/Cart';

class IntegratedCartService {
  
  async getCartWithItems(cartId: string): Promise<CartWithItems> {
    try {
      return await realCartService.getCartWithItems() || {
        id: cartId,
        totalOrder: 0,
        activeStatus: true,
        cartItemId: [],
        items: []
      };
    } catch (error) {
      console.error('Erro ao buscar carrinho com itens:', error);
      throw new Error('Não foi possível buscar o carrinho completo');
    }
  }

  async getActiveCartWithItems(): Promise<CartWithItems | null> {
    try {
      return await realCartService.getCartWithItems();
    } catch (error) {
      console.error('Erro ao buscar carrinho ativo com itens:', error);
      return null;
    }
  }

  async addProductToActiveCart(productId: string, quantity: number, unitPrice: number): Promise<{cart: Cart, item: CartItem}> {
    try {
      console.log('Adicionando produto ao carrinho:', { productId, quantity, unitPrice });
      
      const result = await realCartService.addProductToCart(productId, quantity, unitPrice);
      
      console.log('Produto adicionado:', result);
      
      const cart: Cart = result.cart || {
        id: 'temp-cart',
        totalOrder: quantity * unitPrice,
        activeStatus: true,
        cartItemId: [result.item.id]
      } as Cart;
      
      return { cart, item: result.item };
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho ativo:', error);
      throw error;
    }
  }

  async removeProductFromActiveCart(cartItemId: string): Promise<Cart | null> {
    try {
      return await realCartService.removeItemFromCart(cartItemId);
    } catch (error) {
      console.error('Erro ao remover produto do carrinho:', error);
      throw new Error('Não foi possível remover o produto do carrinho');
    }
  }

  async updateProductQuantityInActiveCart(cartItemId: string, newQuantity: number): Promise<{cart: Cart, item: CartItem}> {
    try {
      const result = await realCartService.updateItemQuantity(cartItemId, newQuantity);
      
      const cart: Cart = result.cart || {
        id: 'temp-cart',
        totalOrder: result.item.totalAmount,
        activeStatus: true,
        cartItemId: [cartItemId]
      } as Cart;
      
      return { cart, item: result.item };
    } catch (error) {
      console.error('Erro ao atualizar quantidade do produto:', error);
      throw new Error('Não foi possível atualizar a quantidade do produto');
    }
  }

  async clearActiveCart(): Promise<Cart | null> {
    try {
      return await realCartService.clearCart();
    } catch (error) {
      console.error('Erro ao limpar carrinho ativo:', error);
      throw new Error('Não foi possível limpar o carrinho');
    }
  }

  async finalizePurchase(): Promise<CartWithItems | null> {
    try {
      console.log("Finalizando pedido...");
      
      const currentCart = await realCartService.getCartWithItems();
      
      if (!currentCart) {
        throw new Error("Nenhum carrinho encontrado para finalizar");
      }
      
      await realCartService.clearCart();
      
      return {
        ...currentCart,
        activeStatus: false
      };
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      throw error;
    }
  }


  async getCartSummary(): Promise<{itemCount: number, totalAmount: number} | null> {
    try {
      return await realCartService.getCartSummary();
    } catch (error) {
      console.error('Erro ao obter resumo do carrinho:', error);
      return null;
    }
  }
}

export default new IntegratedCartService();