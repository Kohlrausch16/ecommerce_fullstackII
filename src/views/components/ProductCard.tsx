import { Product } from "../../types/Products";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description}</p>

          <ul className="list-unstyled small text-muted">
            <li>Preço: R$ {product.price.toFixed(2)}</li>
            <li>
              Dimensões: {product.height} x {product.width} x {product.length} cm
            </li>
            <li>Status: {product.status ? "Ativo ✅" : "Inativo ❌"}</li>
          </ul>

          {product.color && product.color.length > 0 && (
            <div className="mb-2">
              {product.color.map((c, i) => (
                <span key={i} className="badge bg-secondary me-1">
                  {c}
                </span>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-between">
            <button className="btn btn-sm btn-outline-primary">Editar</button>
            <button className="btn btn-sm btn-outline-danger">Excluir</button>
          </div>
        </div>
        <div className="card-footer text-muted small">
          Criado em: {new Date(product.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
