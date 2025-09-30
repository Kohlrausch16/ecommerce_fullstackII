import api from './api';
import cartItemService from './cartItemService';
import { Cart, CartItem, CartWithItems } from '../types/Cart';

class RealCartService {
  
  private async getClientId(): Promise<string | null> {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        return null;
      }

      const user = JSON.parse(userData);
      console.log('ID do cliente para usar como cartId:', user.id);
      return user.id || null;
    } catch (error) {
      console.error('Erro ao obter ID do cliente:', error);
      return null;
    }
  }

  async getClientCart(): Promise<Cart | null> {
    try {
      const clientId = await this.getClientId();
      
      if (!clientId) {
        console.warn('ID do cliente não encontrado');
        return null;
      }

      console.log(`Buscando carrinho com ID: ${clientId}`);
      const response = await api.get(`/carrinho/${clientId}`);
      console.log('Carrinho encontrado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar carrinho do cliente:', error);
      return null;
    }
  }

  async getCartWithItems(): Promise<CartWithItems | null> {
    try {
      const cart = await this.getClientCart();
      
      if (!cart) {
        return null;
      }

      const items: CartItem[] = [];
      
      if (cart.cartItemId && cart.cartItemId.length > 0) {
        for (const itemId of cart.cartItemId) {
          try {
            const id = typeof itemId === 'string' ? itemId : itemId.id || itemId.toString();
            const item = await cartItemService.getCartItemById(id);
            if (item.activeStatus) {
              items.push(item);
            }
          } catch (error) {
            console.warn(`Erro ao buscar item ${itemId}:`, error);
          }
        }
      }

      return {
        ...cart,
        items
      };
    } catch (error) {
      console.error('Erro ao buscar carrinho com itens:', error);
      return null;
    }
  }

  async addProductToCart(productId: string, quantity: number, unitPrice: number): Promise<{cart: Cart | null, item: CartItem}> {
    try {
      console.log('Adicionando produto ao carrinho:', { productId, quantity, unitPrice });
      
      const item = await cartItemService.addCartItem({
        productQtd: quantity,
        totalAmount: quantity * unitPrice,
        productId: productId,
        activeStatus: true
      });

      console.log('Item adicionado:', item);

      const cart = await this.getClientCart();
      
      if (!cart) {
        console.warn('Cliente não possui carrinho, item adicionado apenas como cart-item');
        return { cart: null, item };
      }

      console.log('Carrinho encontrado:', cart);

      return { cart, item };
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      throw error;
    }
  }

  async removeItemFromCart(cartItemId: string): Promise<Cart | null> {
    try {
      await cartItemService.removeCartItem(cartItemId);
      
      return await this.getClientCart();
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      throw error;
    }
  }

  async updateItemQuantity(cartItemId: string, newQuantity: number): Promise<{cart: Cart | null, item: CartItem}> {
    try {
      const item = await cartItemService.updateCartItem(cartItemId, {
        productQtd: newQuantity
      });

      const cart = await this.getClientCart();

      return { cart, item };
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw error;
    }
  }

  async getCartSummary(): Promise<{itemCount: number, totalAmount: number} | null> {
    try {
      const cartWithItems = await this.getCartWithItems();
      
      if (!cartWithItems) {
        return { itemCount: 0, totalAmount: 0 };
      }

      const itemCount = cartWithItems.items.reduce((count, item) => count + item.productQtd, 0);
      const totalAmount = cartWithItems.items.reduce((total, item) => total + item.totalAmount, 0);

      return { itemCount, totalAmount };
    } catch (error) {
      console.error('Erro ao obter resumo do carrinho:', error);
      return null;
    }
  }

  async clearCart(): Promise<Cart | null> {
    try {
      const cartWithItems = await this.getCartWithItems();
      
      if (!cartWithItems) {
        return null;
      }

      for (const item of cartWithItems.items) {
        try {
          await cartItemService.removeCartItem(item.id);
        } catch (error) {
          console.warn(`Erro ao remover item ${item.id}:`, error);
        }
      }

      return await this.getClientCart();
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw error;
    }
  }
}

export default new RealCartService();