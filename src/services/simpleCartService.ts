import cartItemService from './cartItemService';
import { Cart, CartItem, CartWithItems } from '../types/Cart';

class SimpleCartService {
  private readonly CART_ITEMS_KEY = 'simpleCartItems';


  private saveItems(items: CartItem[]): void {
    localStorage.setItem(this.CART_ITEMS_KEY, JSON.stringify(items));
  }


  private getStoredItems(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.CART_ITEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  async addProduct(productId: string, quantity: number, unitPrice: number): Promise<{cart: Cart, item: CartItem}> {
    try {
      console.log('Adicionando produto:', { productId, quantity, unitPrice });

      const newItem = await cartItemService.addCartItem({
        productQtd: quantity,
        totalAmount: quantity * unitPrice,
        productId: productId,
        activeStatus: true
      });

      console.log('Item adicionado no backend:', newItem);

      const currentItems = this.getStoredItems();
      const updatedItems = [...currentItems, newItem];
      this.saveItems(updatedItems);

      const cart: Cart = {
        id: 'virtual-cart',
        totalOrder: updatedItems.reduce((total, item) => total + item.totalAmount, 0),
        activeStatus: true,
        cartItemId: updatedItems.map(item => item.id)
      } as Cart;

      return { cart, item: newItem };
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      
      const mockItem: CartItem = {
        id: `local-${Date.now()}`,
        productQtd: quantity,
        totalAmount: quantity * unitPrice,
        activeStatus: true,
        productId: productId
      } as CartItem;

      const currentItems = this.getStoredItems();
      const updatedItems = [...currentItems, mockItem];
      this.saveItems(updatedItems);

      const cart: Cart = {
        id: 'local-cart',
        totalOrder: updatedItems.reduce((total, item) => total + item.totalAmount, 0),
        activeStatus: true,
        cartItemId: updatedItems.map(item => item.id)
      } as Cart;

      console.log('Produto adicionado localmente:', { cart, item: mockItem });
      return { cart, item: mockItem };
    }
  }

  async removeItem(itemId: string): Promise<Cart> {
    try {
      await cartItemService.removeCartItem(itemId);
    } catch (error) {
      console.warn('Erro ao remover do backend:', error);
    }

    const currentItems = this.getStoredItems();
    const updatedItems = currentItems.filter(item => item.id !== itemId);
    this.saveItems(updatedItems);

    return {
      id: 'virtual-cart',
      totalOrder: updatedItems.reduce((total, item) => total + item.totalAmount, 0),
      activeStatus: true,
      cartItemId: updatedItems.map(item => item.id)
    } as Cart;
  }


  async updateQuantity(itemId: string, newQuantity: number): Promise<{cart: Cart, item: CartItem}> {
    try {
      const updatedItem = await cartItemService.updateCartItem(itemId, {
        productQtd: newQuantity
      });

      const currentItems = this.getStoredItems();
      const itemIndex = currentItems.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        currentItems[itemIndex] = updatedItem;
        this.saveItems(currentItems);
      }

      const cart: Cart = {
        id: 'virtual-cart',
        totalOrder: currentItems.reduce((total, item) => total + item.totalAmount, 0),
        activeStatus: true,
        cartItemId: currentItems.map(item => item.id)
      } as Cart;

      return { cart, item: updatedItem };
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      
      const currentItems = this.getStoredItems();
      const itemIndex = currentItems.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        const item = currentItems[itemIndex];
        item.productQtd = newQuantity;
        item.totalAmount = newQuantity * (item.totalAmount / item.productQtd); // Calcula preço unitário
        this.saveItems(currentItems);

        const cart: Cart = {
          id: 'local-cart',
          totalOrder: currentItems.reduce((total, item) => total + item.totalAmount, 0),
          activeStatus: true,
          cartItemId: currentItems.map(item => item.id)
        } as Cart;

        return { cart, item };
      }
      
      throw error;
    }
  }

  async getCartWithItems(): Promise<CartWithItems> {
    const items = this.getStoredItems();
    
    return {
      id: 'virtual-cart',
      totalOrder: items.reduce((total, item) => total + item.totalAmount, 0),
      activeStatus: true,
      cartItemId: items.map(item => item.id),
      items: items
    };
  }

  async clearCart(): Promise<Cart> {
    const items = this.getStoredItems();
    
    for (const item of items) {
      try {
        await cartItemService.removeCartItem(item.id);
      } catch (error) {
        console.warn(`Erro ao remover item ${item.id} do backend:`, error);
      }
    }

    this.saveItems([]);

    return {
      id: 'virtual-cart',
      totalOrder: 0,
      activeStatus: true,
      cartItemId: []
    } as Cart;
  }


  getCartSummary(): {itemCount: number, totalAmount: number} {
    const items = this.getStoredItems();
    
    return {
      itemCount: items.reduce((count, item) => count + item.productQtd, 0),
      totalAmount: items.reduce((total, item) => total + item.totalAmount, 0)
    };
  }
}

export default new SimpleCartService();