import { Product } from "../../types/Products";
import { useAuth } from "../../hooks/useAuth";
import { ProductModel } from "../../models/ProductModel";
import useCart from "../../hooks/useCart";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProductFormModal from "./ProductFormModal";

interface Props {
  product: Product;
  onProductUpdate?: () => void;
}

const ProductCard = ({ product, onProductUpdate }: Props) => {
  const { isAdmin } = useAuth();
  const { addProduct } = useCart();
  const [loadingCart, setLoadingCart] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleProductSaved = () => {
    if (onProductUpdate) {
      onProductUpdate();
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      try {
        await ProductModel.delete(product.id);
        alert('Produto excluído com sucesso!');
        if (onProductUpdate) {
          onProductUpdate();
        }
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto. Tente novamente.');
      }
    }
  };

  const handleAddToCart = async () => {
    try {
      setLoadingCart(true);
      await addProduct(product.id, 1, product.price);
      alert(`${product.name} foi adicionado ao carrinho!`);
    } catch (error) {
      console.error('Erro ao adicionar produto ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho. Tente novamente.');
    } finally {
      setLoadingCart(false);
    }
  };

  return (
    <div className="col">
      <div className="card border-0 shadow-sm h-100" style={{ transition: 'transform 0.2s ease', cursor: 'pointer' }}>
        {/* Header do Card */}
        <div className="card-header bg-white border-0 pt-4 pb-2">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="card-title mb-1 fw-bold">
                <Link 
                  to={`/product/${product.id}`} 
                  className="text-dark text-decoration-none"
                  style={{ transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#0d6efd'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
                >
                  {product.name}
                </Link>
              </h5>
              <div className="d-flex align-items-center">
                <span className={`badge ${product.status ? 'bg-success' : 'bg-secondary'} me-2`}>
                  {product.status ? 'Disponível' : 'Indisponível'}
                </span>
                <small className="text-muted">
                  {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                </small>
              </div>
            </div>
            <div className="text-end">
              <h4 className="text-primary fw-bold mb-0">
                R$ {product.price.toFixed(2)}
              </h4>
            </div>
          </div>
        </div>

        {/* Corpo do Card */}
        <div className="card-body pt-2">
          <p className="card-text text-muted mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
            {product.description}
          </p>

          {/* Especificações */}
          <div className="mb-3">
            <h6 className="text-secondary mb-2" style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Especificações
            </h6>
            <div className="row g-2">
              <div className="col-12">
                <div className="d-flex justify-content-between py-1" style={{ fontSize: '0.9rem' }}>
                  <span className="text-muted">Dimensões:</span>
                  <span className="fw-medium">{product.height} × {product.width} × {product.length} cm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cores disponíveis */}
          {product.color && product.color.length > 0 && (
            <div className="mb-3">
              <h6 className="text-secondary mb-2" style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Cores Disponíveis
              </h6>
              <div className="d-flex flex-wrap gap-1">
                {product.color.map((c, i) => (
                  <span 
                    key={i} 
                    className="badge bg-light text-dark border"
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer do Card com botões */}
        <div className="card-footer bg-white border-0 pt-0 pb-4">
          {isAdmin ? (
            <div className="d-grid gap-2 d-md-flex justify-content-md-center">
              <button 
                className="btn btn-outline-primary btn-sm flex-fill"
                onClick={handleEdit}
                title="Editar produto"
                style={{ borderRadius: '8px', padding: '0.6rem 1rem' }}
              >
                <i className="bi bi-pencil me-2"></i>
                Editar
              </button>
              <button 
                className="btn btn-outline-danger btn-sm flex-fill"
                onClick={handleDelete}
                title="Excluir produto"
                style={{ borderRadius: '8px', padding: '0.6rem 1rem' }}
              >
                <i className="bi bi-trash me-2"></i>
                Excluir
              </button>
            </div>
          ) : (
            <div className="d-grid gap-2">
              <Link 
                to={`/product/${product.id}`}
                className="btn btn-outline-primary"
                style={{ 
                  borderRadius: '8px', 
                  padding: '0.6rem 1.5rem',
                  fontWeight: '500',
                  textDecoration: 'none'
                }}
              >
                <i className="bi bi-eye me-2"></i>
                Ver Detalhes
              </Link>
              <button 
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={loadingCart || !product.status}
                style={{ 
                  borderRadius: '8px', 
                  padding: '0.8rem 1.5rem',
                  fontWeight: '500',
                  boxShadow: '0 4px 12px rgba(13, 110, 253, 0.15)'
                }}
              >
                {loadingCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Adicionando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cart-plus me-2"></i>
                    {product.status ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Edição */}
      <ProductFormModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onProductSaved={handleProductSaved}
        product={product}
      />
    </div>
  );
};

export default ProductCard;
