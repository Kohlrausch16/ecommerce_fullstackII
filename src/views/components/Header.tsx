import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useCart from "../../hooks/useCart"; 
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { CartWithItems } from "../../types/Cart";

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart, finalizePurchase, refreshCart } = useCart();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [finalizedOrder, setFinalizedOrder] = useState<CartWithItems | null>(null);
  const [loadingFinalize, setLoadingFinalize] = useState(false);
  const [errorFinalize, setErrorFinalize] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm.trim());
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value.trim());
  };

  // Chamado ao clicar em "Finalizar Compra"


const handleFinalizePurchase = async () => {
  setLoadingFinalize(true);
  setErrorFinalize(null);
  try {
    const finalizedCart = await finalizePurchase();
    setFinalizedOrder(finalizedCart);
    setShowOrderModal(true);
    await refreshCart();
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro ao finalizar compra";
    setErrorFinalize(errorMessage);
  } finally {
    setLoadingFinalize(false);
  }
};


  return (
    <>
      <header className="bg-dark py-2 sticky-top shadow-sm">
        <div className="container d-flex align-items-center">
          <Link to="/" className="navbar-brand text-white me-3">
            <strong>Loja</strong>
          </Link>
          <form className="d-flex flex-grow-1 me-3" role="search" onSubmit={handleSearch}>
            <input
              className="form-control"
              type="search"
              placeholder="Pesquise relógios..."
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className="btn btn-outline-light ms-2" type="submit">
              <i className="bi bi-search"></i>
            </button>
            {searchTerm && (
              <button
                type="button"
                className="btn btn-outline-light ms-1"
                onClick={() => {
                  setSearchTerm("");
                  if (onSearch) onSearch("");
                }}
                title="Limpar pesquisa"
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </form>
          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-white text-decoration-none me-3"
                  title="Ver meu perfil"
                >
                  <i className="bi bi-person-check me-1"></i>
                  Olá, {user?.name} {user?.role === "admin" && "(Admin)"}
                </Link>
                <button onClick={handleLogout} className="btn btn-link text-white me-3" title="Sair">
                  <i className="bi bi-box-arrow-right"></i> Sair
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="btn btn-link text-white me-2"
                  title="Entrar"
                >
                  <i className="bi bi-person"></i> Entrar
                </button>
                <button
                  onClick={() => setShowRegisterModal(true)}
                  className="btn btn-outline-light btn-sm me-3"
                  title="Criar conta"
                >
                  <i className="bi bi-person-plus"></i> Cadastrar
                </button>
              </>
            )}
            <button
              type="button"
              className="btn btn-link text-white"
              data-bs-toggle="modal"
              data-bs-target="#cartModal"
            >
              <i className="bi bi-cart"></i> Cart
            </button>
          </div>
        </div>

        {/* Modal do Carrinho */}
        <div
          className="modal fade"
          id="cartModal"
          tabIndex={-1}
          aria-labelledby="cartModalLabel"
          aria-hidden="true"
          data-bs-backdrop="false"
          data-bs-keyboard="true"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="cartModalLabel">Carrinho</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                {cart?.items.length ? (
                  <ul>
                    {cart.items.map(item => (
                      <li key={item.id}>
                        {item.productQtd} x {typeof item.productId === 'string' ? item.productId : item.productId.name} - R$ {item.totalAmount.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Seu carrinho está vazio por enquanto 🛒</p>
                )}
                {errorFinalize && <div className="alert alert-danger">{errorFinalize}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button
                  className="btn btn-primary"
                  onClick={handleFinalizePurchase}
                  disabled={loadingFinalize || !cart?.items.length}
                >
                  {loadingFinalize ? "Finalizando..." : "Finalizar Compra"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal do resumo do pedido finalizado */}
      <div className={`modal fade ${showOrderModal ? 'show d-block' : ''}`} 
           style={{ backgroundColor: showOrderModal ? 'rgba(0,0,0,0.5)' : 'transparent', zIndex: showOrderModal ? 1070 : -1 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Pedido Finalizado</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setShowOrderModal(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {finalizedOrder ? (
                <>
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Seu pedido foi realizado com sucesso!
                  </div>
                  <div className="row mb-3">
                    <div className="col-6">
                      <strong>Total de itens:</strong> {finalizedOrder.items.reduce((acc, item) => acc + item.productQtd, 0)}
                    </div>
                    <div className="col-6 text-end">
                      <strong>Total da compra:</strong> <span className="text-success">R$ {finalizedOrder.totalOrder.toFixed(2)}</span>
                    </div>
                  </div>
                  <h6>Itens do pedido:</h6>
                  <ul className="list-group list-group-flush">
                    {finalizedOrder.items.map(item => (
                      <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                          {item.productQtd} x{" "}
                          {typeof item.productId === "string" ? 
                            item.productId : 
                            item.productId.name
                          }
                        </span>
                        <span className="badge bg-primary rounded-pill">
                          R$ {item.totalAmount.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Não há pedido para mostrar.</p>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowOrderModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};

export default Header;
