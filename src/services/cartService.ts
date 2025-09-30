import api from './api';
import { Cart, CreateCartData, UpdateCartData } from '../types/Cart';

class CartService {
  async getCarts(): Promise<Cart[]> {
    try {
      console.warn('Rota GET /carrinho não configurada no backend');
      return [];
    } catch (error) {
      console.error('Erro ao buscar carrinhos:', error);
      return [];
    }
  }

  async getCartById(id: string): Promise<Cart> {
    try {
      const response = await api.get(`/carrinho/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      throw new Error('Não foi possível buscar o carrinho');
    }
  }

  async createCart(cartData: CreateCartData): Promise<Cart> {
    try {
      console.warn('Rota POST /carrinho não configurada no backend');
      // Retorna um carrinho mock
      return {
        id: `mock-cart-${Date.now()}`,
        totalOrder: cartData.totalOrder,
        activeStatus: cartData.activeStatus ?? true,
        cartItemId: cartData.cartItemId ?? []
      } as Cart;
    } catch (error) {
      console.error('Erro ao criar carrinho:', error);
      throw new Error('Não foi possível criar o carrinho');
    }
  }

  async updateCart(id: string, cartData: UpdateCartData): Promise<Cart> {
    try {
      console.warn('Rota PUT /carrinho/:id não configurada no backend');
      // Retorna um carrinho mock atualizado
      return {
        id: id,
        totalOrder: cartData.totalOrder || 0,
        activeStatus: cartData.activeStatus ?? true,
        cartItemId: []
      } as Cart;
    } catch (error) {
      console.error('Erro ao atualizar carrinho:', error);
      throw new Error('Não foi possível atualizar o carrinho');
    }
  }

  async deleteCart(id: string): Promise<void> {
    try {
      console.warn(`Rota DELETE /carrinho/${id} não configurada no backend`);
    } catch (error) {
      console.error('Erro ao excluir carrinho:', error);
      throw new Error('Não foi possível excluir o carrinho');
    }
  }

  async getActiveCart(): Promise<Cart | null> {
    try {
      // Usa o ID do cliente logado como cartId
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.warn('Usuário não está logado');
        return null;
      }

      const user = JSON.parse(userData);
      if (!user.id) {
        console.warn('ID do usuário não encontrado');
        return null;
      }

      console.log('Buscando carrinho com ID do cliente:', user.id);
      try {
        return await this.getCartById(user.id);
      } catch (error) {
        console.warn('Carrinho não encontrado para este cliente:', error);
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar carrinho ativo:', error);
      return null;
    }
  }

  /**
   * Criar carrinho ativo para o usuário (método auxiliar)
   */
  async createActiveCart(): Promise<Cart> {
    try {
      return await this.createCart({
        totalOrder: 0,
        activeStatus: true,
        cartItemId: []
      });
    } catch (error) {
      console.error('Erro ao criar carrinho ativo:', error);
      throw new Error('Não foi possível criar o carrinho');
    }
  }

  /**
   * Obter ou criar carrinho ativo (método auxiliar)
   */
  async getOrCreateActiveCart(): Promise<Cart> {
    try {
      let cart = await this.getActiveCart();
      
      if (!cart) {
        cart = await this.createActiveCart();
      }
      
      return cart;
    } catch (error) {
      console.error('Erro ao obter ou criar carrinho ativo:', error);
      throw new Error('Não foi possível acessar o carrinho');
    }
  }

  /**
   * Calcular total do carrinho com base nos itens (método auxiliar)
   */
  calculateCartTotal(items: { totalAmount: number }[]): number {
    return items.reduce((total, item) => total + item.totalAmount, 0);
  }
}

export default new CartService();