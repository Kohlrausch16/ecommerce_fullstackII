import api from './api';
import { Cart, CreateCartData, UpdateCartData } from '../types/Cart';

class CartService {
  /**
   * Buscar todos os carrinhos
   */
  async getCarts(): Promise<Cart[]> {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar carrinhos:', error);
      throw new Error('Não foi possível buscar os carrinhos');
    }
  }

  /**
   * Buscar carrinho por ID
   */
  async getCartById(id: string): Promise<Cart> {
    try {
      const response = await api.get(`/cart/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
      throw new Error('Não foi possível buscar o carrinho');
    }
  }

  /**
   * Criar novo carrinho
   */
  async createCart(cartData: CreateCartData): Promise<Cart> {
    try {
      const response = await api.post('/cart', {
        totalOrder: cartData.totalOrder,
        activeStatus: cartData.activeStatus ?? true,
        cartItemId: cartData.cartItemId ?? []
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar carrinho:', error);
      throw new Error('Não foi possível criar o carrinho');
    }
  }

  /**
   * Atualizar carrinho completo
   */
  async updateCart(id: string, cartData: UpdateCartData): Promise<Cart> {
    try {
      const response = await api.put(`/cart/${id}`, cartData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar carrinho:', error);
      throw new Error('Não foi possível atualizar o carrinho');
    }
  }

  /**
   * Excluir carrinho
   */
  async deleteCart(id: string): Promise<void> {
    try {
      await api.delete(`/cart/${id}`);
    } catch (error) {
      console.error('Erro ao excluir carrinho:', error);
      throw new Error('Não foi possível excluir o carrinho');
    }
  }

  /**
   * Buscar carrinho ativo do usuário (método auxiliar)
   * Busca por carrinhos ativos e retorna o primeiro encontrado
   */
  async getActiveCart(): Promise<Cart | null> {
    try {
      const carts = await this.getCarts();
      const activeCart = carts.find(cart => cart.activeStatus === true);
      return activeCart || null;
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