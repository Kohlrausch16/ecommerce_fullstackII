import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import supplierService from "../../services/supplierService";
import { CreateSupplierData } from "../../types/Supplier";

const SupplierFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState<CreateSupplierData>({
    name: "",
    email: "",
    phone: "",
    cnpj: "",
    adressId: "a1117a8f-86a9-4024-9158-0aa54f6ac001", // ID fixo de endereço existente
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode && id) {
      loadSupplier(id);
    }
  }, [id, isEditMode]);

  const loadSupplier = async (supplierId: string) => {
    try {
      setLoading(true);
      const supplier = await supplierService.getSupplierById(supplierId);
      setFormData({
        name: supplier.name,
        email: supplier.email,
        phone: supplier.phone,
        cnpj: supplier.cnpj,
        adressId: supplier.adressId || "a1117a8f-86a9-4024-9158-0aa54f6ac001",
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validações básicas
    if (!formData.name || !formData.email || !formData.phone || !formData.cnpj) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    try {
      setLoading(true);
      if (isEditMode && id) {
        await supplierService.updateSupplier(id, formData);
      } else {
        await supplierService.addSupplier(formData);
      }
      navigate("/suppliers");
    } catch (err: any) {
      console.error('Erro ao salvar fornecedor:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao salvar fornecedor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className={`bi ${isEditMode ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                  {isEditMode ? "Editar Fornecedor" : "Novo Fornecedor"}
                </h4>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nome <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Audi"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Ex: audi@gmail.com"
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">
                        Telefone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ex: 12345678"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="cnpj" className="form-label">
                        CNPJ <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cnpj"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleChange}
                        placeholder="Ex: 12.123.123/0001-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate("/suppliers")}
                      disabled={loading}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
        </div>
      </div>
    </>
  );
};

export default SupplierFormPage;
