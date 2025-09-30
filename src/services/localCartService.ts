import { CartItem, CartWithItems } from '../types/Cart';
import cartItemService from './cartItemService';

class LocalCartService {
  private readonly CART_STORAGE_KEY = 'localCartItems';

  private saveCartItems(items: CartItem[]): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
  }

  private getStoredCartItems(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao recuperar itens do carrinho:', error);
      return [];
    }
  }

  async addProduct(productId: string, quantity: number, unitPrice: number): Promise<CartItem> {
    try {
      console.log('Adicionando produto ao carrinho:', { productId, quantity, unitPrice });
      
      const newItem = await cartItemService.addCartItem({
        productQtd: quantity,
        totalAmount: quantity * unitPrice,
        productId: productId,
        activeStatus: true
      });

      console.log('Item adicionado no backend:', newItem);

      const currentItems = this.getStoredCartItems();
      const updatedItems = [...currentItems, newItem];
      this.saveCartItems(updatedItems);

      return newItem;
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      throw error;
    }
  }

  async removeItem(cartItemId: string): Promise<void> {
    try {
      await cartItemService.removeCartItem(cartItemId);

      const currentItems = this.getStoredCartItems();
      const updatedItems = currentItems.filter(item => item.id !== cartItemId);
      this.saveCartItems(updatedItems);
    } catch (error) {
      console.error('Erro ao remover item:', error);
      throw error;
    }
  }

  async updateQuantity(cartItemId: string, newQuantity: number): Promise<CartItem> {
    try {
      const updatedItem = await cartItemService.updateCartItem(cartItemId, {
        productQtd: newQuantity
      });

      const currentItems = this.getStoredCartItems();
      const updatedItems = currentItems.map(item => 
        item.id === cartItemId ? updatedItem : item
      );
      this.saveCartItems(updatedItems);

      return updatedItem;
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  }

  async getCart(): Promise<CartWithItems> {
    try {
      const items = this.getStoredCartItems();
      const totalOrder = items.reduce((total, item) => total + item.totalAmount, 0);

      const cart: CartWithItems = {
        id: 'local-cart',
        totalOrder,
        activeStatus: true,
        cartItemId: items.map(item => item.id),
        items: items.filter(item => item.activeStatus)
      };

      return cart;
    } catch (error) {
      console.error('Erro ao obter carrinho:', error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      const items = this.getStoredCartItems();
      
      for (const item of items) {
        try {
          await cartItemService.removeCartItem(item.id);
        } catch (error) {
          console.warn(`Erro ao remover item ${item.id}:`, error);
        }
      }

      this.saveCartItems([]);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    }
  }

  getCartSummary(): { itemCount: number; totalAmount: number } {
    const items = this.getStoredCartItems();
    const activeItems = items.filter(item => item.activeStatus);
    
    return {
      itemCount: activeItems.reduce((count, item) => count + item.productQtd, 0),
      totalAmount: activeItems.reduce((total, item) => total + item.totalAmount, 0)
    };
  }

  async syncWithBackend(): Promise<void> {
    try {
      console.log('Carrinho local mantido - sincronização limitada pela API');
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  }
}

export default new LocalCartService();