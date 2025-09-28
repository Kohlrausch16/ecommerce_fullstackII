import api from './api';
import { CartItem, CreateCartItemData, UpdateCartItemData } from '../types/Cart';

class CartItemService {
  /**
   * Buscar todos os itens do carrinho
   */
  async getCartItems(): Promise<CartItem[]> {
    try {
      const response = await api.get('/cart-item');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar itens do carrinho:', error);
      throw new Error('Não foi possível buscar os itens do carrinho');
    }
  }

  /**
   * Buscar item do carrinho por ID
   */
  async getCartItemById(id: string): Promise<CartItem> {
    try {
      const response = await api.get(`/cart-item/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar item do carrinho:', error);
      throw new Error('Não foi possível buscar o item do carrinho');
    }
  }

  /**
   * Adicionar item ao carrinho
   */
  async addCartItem(itemData: CreateCartItemData): Promise<CartItem> {
    try {
      const response = await api.post('/cart-item', {
        productQtd: itemData.productQtd,
        totalAmount: itemData.totalAmount,
        activeStatus: itemData.activeStatus ?? true,
        productId: itemData.productId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar item ao carrinho:', error);
      throw new Error('Não foi possível adicionar o item ao carrinho');
    }
  }

  /**
   * Atualizar item do carrinho
   */
  async updateCartItem(id: string, itemData: UpdateCartItemData): Promise<CartItem> {
    try {
      const response = await api.put(`/cart-item/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar item do carrinho:', error);
      throw new Error('Não foi possível atualizar o item do carrinho');
    }
  }

  /**
   * Remover item do carrinho
   */
  async removeCartItem(id: string): Promise<void> {
    try {
      await api.delete(`/cart-item/${id}`);
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      throw new Error('Não foi possível remover o item do carrinho');
    }
  }

  /**
   * Buscar itens por produto (método auxiliar)
   */
  async getCartItemsByProduct(productId: string): Promise<CartItem[]> {
    try {
      const allItems = await this.getCartItems();
      return allItems.filter(item => {
        // Verificar se productId é string ou objeto Product
        if (typeof item.productId === 'string') {
          return item.productId === productId;
        } else {
          return item.productId.id === productId;
        }
      });
    } catch (error) {
      console.error('Erro ao buscar itens por produto:', error);
      return [];
    }
  }

  /**
   * Adicionar produto ao carrinho com verificação de existência
   */
  async addProductToCart(productId: string, quantity: number, unitPrice: number): Promise<CartItem> {
    try {
      const totalAmount = quantity * unitPrice;
      
      // Verificar se o produto já existe no carrinho
      const existingItems = await this.getCartItemsByProduct(productId);
      
      if (existingItems.length > 0) {
        // Se existe, atualizar a quantidade e total
        const existingItem = existingItems[0];
        const newQuantity = existingItem.productQtd + quantity;
        const newTotal = newQuantity * unitPrice;
        
        return await this.updateCartItem(existingItem.id, {
          productQtd: newQuantity,
          totalAmount: newTotal
        });
      } else {
        // Se não existe, criar novo item
        return await this.addCartItem({
          productQtd: quantity,
          totalAmount,
          productId,
          activeStatus: true
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      throw new Error('Não foi possível adicionar o produto ao carrinho');
    }
  }

  /**
   * Atualizar quantidade de um produto no carrinho
   */
  async updateProductQuantity(cartItemId: string, newQuantity: number, unitPrice: number): Promise<CartItem> {
    try {
      if (newQuantity <= 0) {
        throw new Error('Quantidade deve ser maior que zero');
      }
      
      const newTotal = newQuantity * unitPrice;
      
      return await this.updateCartItem(cartItemId, {
        productQtd: newQuantity,
        totalAmount: newTotal
      });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw new Error('Não foi possível atualizar a quantidade do produto');
    }
  }

  /**
   * Calcular total de um item baseado na quantidade e preço unitário
   */
  calculateItemTotal(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }

  /**
   * Limpar carrinho removendo todos os itens
   */
  async clearCart(): Promise<void> {
    try {
      const items = await this.getCartItems();
      const deletePromises = items
        .filter(item => item.activeStatus)
        .map(item => this.removeCartItem(item.id));
      
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw new Error('Não foi possível limpar o carrinho');
    }
  }
}

export default new CartItemService();