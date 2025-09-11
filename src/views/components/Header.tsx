import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header data-bs-theme="dark">
      <div className="navbar navbar-dark bg-dark shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <strong>🏪 Marketplace</strong>
          </Link>
          <div className="navbar-nav ms-auto">
            <Link to="/" className="nav-link active">
              Home
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;