import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import cartService from "../../services/cartService";
import cartItemService from "../../services/cartItemService";
import orderService from "../../services/orderService";
import { getProductById } from "../../services/productService";
import { Cart, CartItem } from "../../types/Cart";
import { Product } from "../../types/Products";

interface CartItemWithProduct extends CartItem {
  product?: Product;
}

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingOrder, setProcessingOrder] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");
      
      const activeCart = await cartService.getActiveCart();
      
      if (!activeCart) {
        setCart(null);
        setCartItems([]);
        return;
      }

      setCart(activeCart);

      // Carregar detalhes dos itens e produtos
      if (activeCart.cartItems && Array.isArray(activeCart.cartItems)) {
        const itemsWithProducts = await Promise.all(
          activeCart.cartItems.map(async (item) => {
            try {
              const product = await getProductById(
                typeof item.productId === 'string' ? item.productId : item.productId.id
              );
              return { ...item, product };
            } catch (err) {
              console.error("Erro ao carregar produto:", err);
              return item;
            }
          })
        );
        setCartItems(itemsWithProducts);
      }
    } catch (err) {
      setError("Erro ao carregar carrinho");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await cartItemService.updateCartItem(itemId, { productQtd: newQuantity });
      await loadCart();
    } catch (err) {
      alert("Erro ao atualizar quantidade");
      console.error(err);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!window.confirm("Deseja remover este item do carrinho?")) return;

    try {
      await cartItemService.removeCartItem(itemId);
      await loadCart();
    } catch (err) {
      alert("Erro ao remover item do carrinho");
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    if (!cart) {
      alert("Carrinho vazio");
      return;
    }

    if (!window.confirm("Finalizar pedido?")) return;

    try {
      setProcessingOrder(true);
      await orderService.createOrder(cart.id);
      alert("Pedido realizado com sucesso!");
      navigate("/home");
    } catch (err) {
      alert("Erro ao criar pedido. Tente novamente.");
      console.error(err);
    } finally {
      setProcessingOrder(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.totalAmount || 0), 0);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando carrinho...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2 className="mb-4">
          <i className="bi bi-cart3 me-2"></i>
          Meu Carrinho
        </h2>

        {error && (
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
        )}

        {!cart || cartItems.length === 0 ? (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Seu carrinho está vazio.
            <button className="btn btn-primary ms-3" onClick={() => navigate("/home")}>
              <i className="bi bi-shop me-2"></i>
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="row">
              <div className="col-lg-8">
                <div className="card shadow-sm mb-4">
                  <div className="card-body">
                    {cartItems.map((item) => (
                      <div key={item.id} className="row mb-3 pb-3 border-bottom">
                        <div className="col-md-8">
                          <h5>{item.product?.name || "Produto"}</h5>
                          <p className="text-muted mb-1">
                            Preço unitário: R$ {item.product?.price.toFixed(2) || "0.00"}
                          </p>
                          <p className="text-muted mb-0">
                            Subtotal: R$ {item.totalAmount.toFixed(2)}
                          </p>
                        </div>
                        <div className="col-md-4 text-end">
                          <div className="input-group input-group-sm mb-2" style={{ maxWidth: "150px", marginLeft: "auto" }}>
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleUpdateQuantity(item.id, item.productQtd - 1)}
                              disabled={item.productQtd <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <input
                              type="number"
                              className="form-control text-center"
                              value={item.productQtd}
                              readOnly
                            />
                            <button
                              className="btn btn-outline-secondary"
                              onClick={() => handleUpdateQuantity(item.id, item.productQtd + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Remover
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card shadow-sm sticky-top" style={{ top: "20px" }}>
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Resumo do Pedido</h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Itens ({cartItems.length}):</span>
                      <span>R$ {calculateTotal().toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong className="text-primary">R$ {calculateTotal().toFixed(2)}</strong>
                    </div>
                    <button
                      className="btn btn-success w-100 mb-2"
                      onClick={handleCheckout}
                      disabled={processingOrder}
                    >
                      {processingOrder ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Finalizar Pedido
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-outline-secondary w-100"
                      onClick={() => navigate("/home")}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Continuar Comprando
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;
