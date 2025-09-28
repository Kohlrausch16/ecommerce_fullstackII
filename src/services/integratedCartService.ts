import cartService from './cartService';
import cartItemService from './cartItemService';
import { Cart, CartItem, CartWithItems } from '../types/Cart';

class IntegratedCartService {
  
  async getCartWithItems(cartId: string): Promise<CartWithItems> {
    try {
      const cart = await cartService.getCartById(cartId);
      const allItems = await cartItemService.getCartItems();
      
      const cartItems = allItems.filter(item => item.activeStatus);
      
      return {
        ...cart,
        items: cartItems
      };
    } catch (error) {
      console.error('Erro ao buscar carrinho com itens:', error);
      throw new Error('Não foi possível buscar o carrinho completo');
    }
  }

  async getActiveCartWithItems(): Promise<CartWithItems | null> {
    try {
      const cart = await cartService.getActiveCart();
      
      if (!cart) {
        return null;
      }
      
      const allItems = await cartItemService.getCartItems();
      const cartItems = allItems.filter(item => item.activeStatus);
      
      return {
        ...cart,
        items: cartItems
      };
    } catch (error) {
      console.error('Erro ao buscar carrinho ativo com itens:', error);
      return null;
    }
  }

  async addProductToActiveCart(productId: string, quantity: number, unitPrice: number): Promise<{cart: Cart, item: CartItem}> {
    try {
      const cart = await cartService.getOrCreateActiveCart();
      
      const item = await cartItemService.addProductToCart(productId, quantity, unitPrice);
      
      const allItems = await cartItemService.getCartItems();
      const activeItems = allItems.filter(item => item.activeStatus);
      const newTotal = cartService.calculateCartTotal(activeItems);
      
      const updatedCart = await cartService.updateCart(cart.id, {
        totalOrder: newTotal
      });
      
      return { cart: updatedCart, item };
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho ativo:', error);
      throw new Error('Não foi possível adicionar o produto ao carrinho');
    }
  }

  async removeProductFromActiveCart(cartItemId: string): Promise<Cart | null> {
    try {
      await cartItemService.removeCartItem(cartItemId);
      
      const cart = await cartService.getActiveCart();
      
      if (!cart) {
        return null;
      }
      
      const allItems = await cartItemService.getCartItems();
      const activeItems = allItems.filter(item => item.activeStatus);
      const newTotal = cartService.calculateCartTotal(activeItems);
      
      return await cartService.updateCart(cart.id, {
        totalOrder: newTotal
      });
    } catch (error) {
      console.error('Erro ao remover produto do carrinho:', error);
      throw new Error('Não foi possível remover o produto do carrinho');
    }
  }

  async updateProductQuantityInActiveCart(cartItemId: string, newQuantity: number, unitPrice: number): Promise<{cart: Cart, item: CartItem}> {
    try {
      const item = await cartItemService.updateProductQuantity(cartItemId, newQuantity, unitPrice);
      
      const cart = await cartService.getActiveCart();
      
      if (!cart) {
        throw new Error('Carrinho ativo não encontrado');
      }
      
      const allItems = await cartItemService.getCartItems();
      const activeItems = allItems.filter(item => item.activeStatus);
      const newTotal = cartService.calculateCartTotal(activeItems);
      
      const updatedCart = await cartService.updateCart(cart.id, {
        totalOrder: newTotal
      });
      
      return { cart: updatedCart, item };
    } catch (error) {
      console.error('Erro ao atualizar quantidade do produto:', error);
      throw new Error('Não foi possível atualizar a quantidade do produto');
    }
  }

  async clearActiveCart(): Promise<Cart | null> {
    try {
      await cartItemService.clearCart();
      
      const cart = await cartService.getActiveCart();
      
      if (!cart) {
        return null;
      }
      
      return await cartService.updateCart(cart.id, {
        totalOrder: 0
      });
    } catch (error) {
      console.error('Erro ao limpar carrinho ativo:', error);
      throw new Error('Não foi possível limpar o carrinho');
    }
  }

  async finalizePurchase(): Promise<Cart | null> {
    try {
      const cart = await cartService.getActiveCart();
      
      if (!cart) {
        throw new Error('Nenhum carrinho ativo encontrado');
      }
      
      return await cartService.updateCart(cart.id, {
        activeStatus: false
      });
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
      throw new Error('Não foi possível finalizar o pedido');
    }
  }

  async getCartSummary(): Promise<{itemCount: number, totalAmount: number} | null> {
    try {
      const cartWithItems = await this.getActiveCartWithItems();
      
      if (!cartWithItems) {
        return null;
      }
      
      const itemCount = cartWithItems.items.reduce((count, item) => count + item.productQtd, 0);
      
      return {
        itemCount,
        totalAmount: cartWithItems.totalOrder
      };
    } catch (error) {
      console.error('Erro ao obter resumo do carrinho:', error);
      return null;
    }
  }
}

export default new IntegratedCartService();