import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProductFormModal from './ProductFormModal';

interface Props {
  onProductAdded?: () => void;
}

const AdminFloatingButton: React.FC<Props> = ({ onProductAdded }) => {
  const { isAdmin } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleAddProduct = () => {
    setShowCreateModal(true);
  };

  const handleProductSaved = () => {
    if (onProductAdded) {
      onProductAdded();
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
    <button
      className="btn btn-primary position-fixed d-flex align-items-center justify-content-center"
      style={{
        bottom: '30px',
        right: '30px',
        borderRadius: '50px',
        width: '70px',
        height: '70px',
        zIndex: 1000,
        boxShadow: '0 8px 25px rgba(13, 110, 253, 0.3)',
        border: 'none',
        transition: 'all 0.3s ease'
      }}
      onClick={handleAddProduct}
      title="Adicionar novo relógio"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <i className="bi bi-plus-lg" style={{ fontSize: '1.5rem' }}></i>
    </button>
    
    {/* Modal de Criação */}
    <ProductFormModal
      show={showCreateModal}
      onHide={() => setShowCreateModal(false)}
      onProductSaved={handleProductSaved}
    />
  </>);
};

export default AdminFloatingButton;