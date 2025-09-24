import { Product } from "../../types/Products";
import ProductCard from "../components/ProductCard";

interface HomeViewProps {
  products: Product[];
  loading: boolean;
  error: string;
  onRetry: () => void;
  onProductUpdate?: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ products, loading, error, onRetry, onProductUpdate }) => {
  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3">Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Erro ao carregar produtos
          </h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-primary" onClick={onRetry}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Header Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold text-dark mb-2">
                  <i className="bi bi-watch me-3 text-primary"></i>
                  Coleção de Relógios
                </h1>
                <p className="text-muted mb-0">Descubra nossa seleção premium de relógios</p>
              </div>
              {products.length > 0 && (
                <div className="text-end">
                  <div className="badge bg-primary fs-6 px-3 py-2">
                    {products.length} produto{products.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="bg-white rounded-3 shadow-sm p-5">
                <i className="bi bi-search display-1 text-muted mb-4"></i>
                <h3 className="text-dark mb-3">Nenhum relógio encontrado</h3>
                <p className="text-muted mb-0">
                  Tente pesquisar com termos diferentes ou explore nossa coleção completa
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onProductUpdate={onProductUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;
