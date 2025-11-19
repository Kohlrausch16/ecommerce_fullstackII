import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import supplierService from "../../services/supplierService";
import { Supplier } from "../../types/Supplier";

const SuppliersPage: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await supplierService.getSuppliers();
      setSuppliers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o fornecedor "${name}"?`)) {
      try {
        await supplierService.deleteSupplier(id);
        await loadSuppliers();
      } catch (err: any) {
        alert(`Erro ao excluir fornecedor: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando fornecedores...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>
            <i className="bi bi-building me-2"></i>
            Fornecedores
          </h2>
          <button 
            className="btn btn-primary"
            onClick={() => navigate("/suppliers/new")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Novo Fornecedor
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {suppliers.length === 0 ? (
          <div className="alert alert-info">
            <i className="bi bi-info-circle me-2"></i>
            Nenhum fornecedor cadastrado.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>CNPJ</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier.id}>
                    <td>
                      <i className="bi bi-building me-2 text-primary"></i>
                      {supplier.name}
                    </td>
                    <td>
                      <i className="bi bi-envelope me-2"></i>
                      {supplier.email}
                    </td>
                    <td>
                      <i className="bi bi-telephone me-2"></i>
                      {supplier.phone}
                    </td>
                    <td>
                      <i className="bi bi-file-text me-2"></i>
                      {supplier.cnpj}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(supplier.id, supplier.name)}
                        title="Excluir"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default SuppliersPage;
