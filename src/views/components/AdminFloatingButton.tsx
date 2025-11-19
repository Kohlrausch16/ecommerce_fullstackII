import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import ProductModal from './ProductModal';

interface AdminFloatingButtonProps {
  onProductAdded?: () => void;
}

const AdminFloatingButton: React.FC<AdminFloatingButtonProps> = ({ onProductAdded }) => {
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const handleAddProduct = () => {
    setShowModal(true);
  };

  const handleSuccess = () => {
    setShowModal(false);
    if (onProductAdded) {
      onProductAdded();
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* Modal de criação/edição */}
      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={null}
        onSuccess={handleSuccess}
      />

      {/* Botão flutuante */}
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
    </>
  );
};

export default AdminFloatingButton;
