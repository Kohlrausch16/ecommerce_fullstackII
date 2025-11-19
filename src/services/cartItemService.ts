import api from './api';
import { CartItem, CreateCartItemData, UpdateCartItemData } from '../types/Cart';

class CartItemService {
  async getCartItems(): Promise<CartItem[]> {
    try {
      console.warn('Rota GET /item-carrinho não implementada no backend');
      return [];
    } catch (error) {
      console.error('Erro ao buscar itens do carrinho:', error);
      return [];
    }
  }

  async getCartItemById(id: string): Promise<CartItem> {
    try {
      const response = await api.get(`/item-carrinho/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar item do carrinho:', error);
      throw new Error('Não foi possível buscar o item do carrinho');
    }
  }

  async addCartItem(itemData: CreateCartItemData): Promise<CartItem> {
    try {
      const response = await api.post('/item-carrinho', {
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

  async updateCartItem(id: string, itemData: UpdateCartItemData): Promise<CartItem> {
    try {
      const response = await api.put(`/item-carrinho/${id}?qtd=${itemData.productQtd}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar item do carrinho:', error);
      throw new Error('Não foi possível atualizar o item do carrinho');
    }
  }

  async removeCartItem(id: string): Promise<void> {
    try {
      // NOTA: Bug no backend - a rota DELETE está faltando a barra inicial
      // Deve ser corrigida no backend: cartItemRouter.delete('/item-carrinho/:id', ...)
      // Por enquanto, usando a rota incorreta do backend
      await api.delete(`/item-carrinho/${id}`);
    } catch (error) {
      console.error('Erro ao remover item do carrinho:', error);
      throw new Error('Não foi possível remover o item do carrinho');
    }
  }

  async getCartItemsByProduct(productId: string): Promise<CartItem[]> {
    try {
      const allItems = await this.getCartItems();
      return allItems.filter(item => {
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

  async addProductToCart(productId: string, quantity: number, unitPrice: number): Promise<CartItem> {
    try {
      const totalAmount = quantity * unitPrice;
      
      const existingItems = await this.getCartItemsByProduct(productId);
      
      if (existingItems.length > 0) {
        const existingItem = existingItems[0];
        const newQuantity = existingItem.productQtd + quantity;
        const newTotal = newQuantity * unitPrice;
        
        return await this.updateCartItem(existingItem.id, {
          productQtd: newQuantity,
          totalAmount: newTotal
        });
      } else {
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

  async updateProductQuantity(cartItemId: string, newQuantity: number): Promise<CartItem> {
    try {
      if (newQuantity <= 0) {
        throw new Error('Quantidade deve ser maior que zero');
      }
      
      return await this.updateCartItem(cartItemId, {
        productQtd: newQuantity
      });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      throw new Error('Não foi possível atualizar a quantidade do produto');
    }
  }

  calculateItemTotal(quantity: number, unitPrice: number): number {
    return quantity * unitPrice;
  }

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