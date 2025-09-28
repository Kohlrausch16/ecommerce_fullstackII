import { useState, useEffect } from 'react';
import { integratedCartService } from '../services';
import { CartWithItems } from '../types/Cart';

interface UseCartReturn {
  cart: CartWithItems | null;
  loading: boolean;
  error: string | null;
  
  addProduct: (productId: string, quantity: number, unitPrice: number) => Promise<void>;
  removeProduct: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number, unitPrice: number) => Promise<void>;
  clearCart: () => Promise<void>;
  finalizePurchase: () => Promise<void>;
  
  itemCount: number;
  totalAmount: number;
  
  refreshCart: () => Promise<void>;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const cartData = await integratedCartService.getActiveCartWithItems();
      setCart(cartData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao carregar carrinho:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const addProduct = async (productId: string, quantity: number, unitPrice: number) => {
    try {
      setLoading(true);
      setError(null);
      await integratedCartService.addProductToActiveCart(productId, quantity, unitPrice);
      await refreshCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (cartItemId: string) => {
    try {
      setLoading(true);
      setError(null);
      await integratedCartService.removeProductFromActiveCart(cartItemId);
      await refreshCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover produto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number, unitPrice: number) => {
    try {
      setLoading(true);
      setError(null);
      await integratedCartService.updateProductQuantityInActiveCart(cartItemId, newQuantity, unitPrice);
      await refreshCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar quantidade';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError(null);
      await integratedCartService.clearActiveCart();
      await refreshCart();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao limpar carrinho';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finalizePurchase = async () => {
    try {
      setLoading(true);
      setError(null);
      await integratedCartService.finalizePurchase();
      setCart(null); 
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar compra';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items.reduce((count, item) => count + item.productQtd, 0) || 0;
  const totalAmount = cart?.totalOrder || 0;

  useEffect(() => {
    loadCart();
  }, []);

  return {
    cart,
    loading,
    error,
    addProduct,
    removeProduct,
    updateQuantity,
    clearCart,
    finalizePurchase,
    itemCount,
    totalAmount,
    refreshCart
  };
};

export default useCart;