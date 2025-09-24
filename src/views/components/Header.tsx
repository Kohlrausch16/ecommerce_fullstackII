import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

interface HeaderProps {
  onSearch?: (searchTerm: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = async () => {
    await logout();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (onSearch) {
      onSearch(value.trim());
    }
  };

  return (
    <>
    <header className="bg-dark py-2 sticky-top shadow-sm">
      <div className="container d-flex align-items-center">
        <Link to="/" className="navbar-brand text-white me-3">
          <strong>Loja</strong>
        </Link>

        {/* Barra de pesquisa */}
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
                setSearchTerm('');
                if (onSearch) onSearch('');
              }}
              title="Limpar pesquisa"
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </form>

        {/* Login e Carrinho */}
        <div className="d-flex align-items-center">
          {isAuthenticated ? (
            <div className="d-flex align-items-center">
              <span className="text-white me-3">
                <i className="bi bi-person-check me-1"></i>
                Olá, {user?.name} {user?.role === 'admin' && '(Admin)'}
              </span>
              <button 
                onClick={handleLogout}
                className="btn btn-link text-white me-3"
                title="Sair"
              >
                <i className="bi bi-box-arrow-right"></i> Sair
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center">
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
            </div>
          )}

          {/* Botão que abre modal do carrinho */}
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
      >
        <div className="modal-dialog modal-lg modal-dialog-end">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="cartModalLabel">Carrinho</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>Seu carrinho está vazio por enquanto 🛒</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Fechar
              </button>
              <Link to="/checkout" className="btn btn-primary">
                Finalizar Compra
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Login */}
      <LoginModal 
        show={showLoginModal} 
        onHide={() => setShowLoginModal(false)} 
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      {/* Modal de Registro */}
      <RegisterModal 
        show={showRegisterModal} 
        onHide={() => setShowRegisterModal(false)} 
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </header>
    </>
  );
};

export default Header;
