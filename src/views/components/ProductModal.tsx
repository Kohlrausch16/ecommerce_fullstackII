import React, { useState, useEffect } from "react";
import { Product } from "../../types/Products";
import { Supplier } from "../../types/Supplier";
import supplierService from "../../services/supplierService";
import { addProduct, updateProduct } from "../../services/productService";

interface ProductModalProps {
  show: boolean;
  onHide: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ show, onHide, product, onSuccess }) => {
  const isEditMode = Boolean(product);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    height: "",
    width: "",
    length: "",
    color: "",
    description: "",
    status: true,
    stockQtd: "",
    year: "",
    supplierId: "",
  });

  useEffect(() => {
    if (show) {
      loadSuppliers();
      if (product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          height: product.height.toString(),
          width: product.width.toString(),
          length: product.length.toString(),
          color: Array.isArray(product.color) ? product.color.join(", ") : product.color,
          description: product.description,
          status: product.status,
          stockQtd: product.stockQtd?.toString() || "0",
          year: product.year || "",
          supplierId: product.supplierId || "",
        });
      } else {
        resetForm();
      }
    }
  }, [show, product]);

  const loadSuppliers = async () => {
    try {
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Erro ao carregar fornecedores:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      height: "",
      width: "",
      length: "",
      color: "",
      description: "",
      status: true,
      stockQtd: "",
      year: "",
      supplierId: "",
    });
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações
    if (!formData.name || !formData.price || !formData.supplierId) {
      setError("Nome, preço e fornecedor são obrigatórios");
      return;
    }

    try {
      setLoading(true);

      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        height: parseFloat(formData.height) || 0,
        width: parseFloat(formData.width) || 0,
        length: parseFloat(formData.length) || 0,
        color: formData.color.split(",").map((c) => c.trim()).filter(c => c),
        description: formData.description,
        status: formData.status,
        stockQtd: parseInt(formData.stockQtd) || 0,
        year: formData.year,
        supplierId: formData.supplierId,
      } as any;

      if (isEditMode && product) {
        await updateProduct(product.id, productData);
      } else {
        await addProduct(productData);
      }

      onSuccess();
      onHide();
    } catch (err) {
      setError("Erro ao salvar produto. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              <i className={`bi ${isEditMode ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
              {isEditMode ? "Editar Produto" : "Novo Produto"}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onHide}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <div className="row">
                <div className="col-md-8 mb-3">
                  <label className="form-label">
                    Nome <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Preço (R$) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Fornecedor <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione um fornecedor</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Quantidade em Estoque</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stockQtd"
                    value={formData.stockQtd}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Ano</label>
                  <input
                    type="text"
                    className="form-control"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Altura (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Largura (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label">Comprimento (cm)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Cores (separadas por vírgula)</label>
                <input
                  type="text"
                  className="form-control"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Preto, Prata, Dourado"
                />
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="status"
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="status">
                  Produto disponível para venda
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onHide} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    {isEditMode ? "Atualizar" : "Cadastrar"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
