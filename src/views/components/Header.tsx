import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="bg-dark py-2 sticky-top shadow-sm">
      <div className="container d-flex align-items-center">
        <Link to="/" className="navbar-brand text-white me-3">
          <strong>Loja</strong>
        </Link>


        {/* Barra de pesquisa */}
        <form className="d-flex flex-grow-1 me-3" role="search">
          <input
            className="form-control"
            type="search"
            placeholder="Pesquise produtos..."
            aria-label="Search"
          />
          <button className="btn btn-outline-light ms-2" type="submit">
            <i className="bi bi-search"></i>
          </button>
        </form>

        {/* Login e Carrinho */}
        <div className="d-flex align-items-center">
          <Link to="/login" className="btn btn-link text-white me-3">
            <i className="bi bi-person"></i> Log In
          </Link>

          {/* Botão que abre modal */}
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
    </header>
  );
};

export default Header;
