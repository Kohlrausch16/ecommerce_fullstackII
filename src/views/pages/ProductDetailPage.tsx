import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product } from '../../types/Products';
import { ProductModel } from '../../models/ProductModel';
import useCart from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import Header from '../components/Header';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct } = useCart();
  const { isAdmin } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    } else {
      navigate('/home');
    }
  }, [id, navigate]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      setError(null);
      const productData = await ProductModel.getById(productId);
      if (productData) {
        setProduct(productData);
      } else {
        setError('Produto não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
      setError('Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
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
    }
  };

  if (loading) {
    return (
      <>
        <Header onSearch={() => {}} />
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-3">Carregando produto...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header onSearch={() => {}} />
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="alert alert-danger">
                <h4 className="alert-heading">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Produto não encontrado
                </h4>
                <p>{error || 'O produto que você está procurando não existe.'}</p>
                <hr />
                <Link to="/home" className="btn btn-primary">
                  <i className="bi bi-arrow-left me-2"></i>
                  Voltar para a loja
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header onSearch={() => {}} />
      <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="container py-4">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home" className="text-decoration-none">
                  <i className="bi bi-house me-1"></i>
                  Início
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/home" className="text-decoration-none">Produtos</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          {/* Produto Detail */}
          <div className="row">
            {/* Imagem do Produto */}
            <div className="col-lg-6 mb-4">
              <div className="bg-white rounded-3 shadow-sm p-4 text-center">
                <div 
                  className="bg-light rounded-3 d-flex align-items-center justify-content-center"
                  style={{ height: '400px' }}
                >
                  <i 
                    className="bi bi-watch text-muted" 
                    style={{ fontSize: '8rem', opacity: 0.3 }}
                  ></i>
                </div>
                <p className="text-muted mt-3 mb-0">
                  <small>Imagem ilustrativa do produto</small>
                </p>
              </div>
            </div>

            {/* Informações do Produto */}
            <div className="col-lg-6">
              <div className="bg-white rounded-3 shadow-sm p-4 h-100">
                {/* Header */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h1 className="h2 fw-bold text-dark mb-2">{product.name}</h1>
                      <span className={`badge ${product.status ? 'bg-success' : 'bg-secondary'} fs-6`}>
                        {product.status ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                    <div className="text-end">
                      <h2 className="text-primary fw-bold mb-0">
                        R$ {product.price.toFixed(2)}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Descrição */}
                <div className="mb-4">
                  <h5 className="text-secondary mb-3">Descrição</h5>
                  <p className="text-muted" style={{ lineHeight: '1.7' }}>
                    {product.description}
                  </p>
                </div>

                {/* Especificações Técnicas */}
                <div className="mb-4">
                  <h5 className="text-secondary mb-3">Especificações Técnicas</h5>
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="border rounded-2 p-3">
                        <h6 className="text-muted mb-1">Dimensões</h6>
                        <p className="fw-medium mb-0">
                          {product.height} × {product.width} × {product.length} cm
                        </p>
                      </div>
                    </div>
                    {product.year && (
                      <div className="col-sm-6">
                        <div className="border rounded-2 p-3">
                          <h6 className="text-muted mb-1">Ano</h6>
                          <p className="fw-medium mb-0">{product.year}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cores Disponíveis */}
                {product.color && product.color.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-secondary mb-3">Cores Disponíveis</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {product.color.map((color, index) => (
                        <span 
                          key={index}
                          className="badge bg-light text-dark border px-3 py-2"
                          style={{ fontSize: '0.9rem' }}
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informações Adicionais */}
                <div className="mb-4">
                  <div className="row g-2 text-sm">
                    <div className="col-6">
                      <span className="text-muted">Adicionado em:</span>
                    </div>
                    <div className="col-6">
                      <span className="fw-medium">
                        {new Date(product.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="col-6">
                      <span className="text-muted">Última atualização:</span>
                    </div>
                    <div className="col-6">
                      <span className="fw-medium">
                        {new Date(product.updatedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ações */}
                <div className="d-grid gap-2">
                  {isAdmin ? (
                    <div className="d-flex gap-2">
                      <Link 
                        to="/home" 
                        className="btn btn-outline-secondary flex-fill"
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Voltar
                      </Link>
                      <button className="btn btn-outline-primary flex-fill">
                        <i className="bi bi-pencil me-2"></i>
                        Editar Produto
                      </button>
                    </div>
                  ) : (
                    <>
                      <button 
                        className="btn btn-primary btn-lg"
                        onClick={handleAddToCart}
                        disabled={loadingCart || !product.status}
                        style={{ 
                          padding: '1rem 2rem',
                          fontSize: '1.1rem',
                          fontWeight: '500'
                        }}
                      >
                        {loadingCart ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" />
                            Adicionando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cart-plus me-2"></i>
                            {product.status ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
                          </>
                        )}
                      </button>
                      <Link 
                        to="/home" 
                        className="btn btn-outline-secondary"
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Continuar Comprando
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;