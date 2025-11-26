import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import orderService from "../../../services/orderService";
import { MonthlyReport, MostSoldProduct, LowStockProduct } from "../../../types/Order";

const AdminDashboard: React.FC = () => {
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [mostSoldProduct, setMostSoldProduct] = useState<MostSoldProduct | null>(null);
  const [lowStockProduct, setLowStockProduct] = useState<LowStockProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Datas padrão: mês atual
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [dateRange, setDateRange] = useState({
    initial: firstDayOfMonth.toISOString().split('T')[0],
    final: lastDayOfMonth.toISOString().split('T')[0],
  });

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [monthly, mostSold, lowStock] = await Promise.all([
        orderService.getMonthlyReport(dateRange.initial, dateRange.final),
        orderService.getMostSoldProduct(),
        orderService.getLowStockProducts(),
      ]);

      setMonthlyReport(monthly);
      setMostSoldProduct(mostSold);
      setLowStockProduct(lowStock);
    } catch (err) {
      setError("Erro ao carregar dados do dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mt-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-3">Carregando dashboard...</p>
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
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard Administrativo
          </h2>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {/* Filtro de Período */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="card-title">
              <i className="bi bi-calendar-range me-2"></i>
              Período de Análise
            </h5>
            <div className="row">
              <div className="col-md-5">
                <label htmlFor="initial" className="form-label">Data Inicial</label>
                <input
                  type="date"
                  className="form-control"
                  id="initial"
                  name="initial"
                  value={dateRange.initial}
                  onChange={handleDateChange}
                />
              </div>
              <div className="col-md-5">
                <label htmlFor="final" className="form-label">Data Final</label>
                <input
                  type="date"
                  className="form-control"
                  id="final"
                  name="final"
                  value={dateRange.final}
                  onChange={handleDateChange}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button 
                  className="btn btn-primary w-100"
                  onClick={loadDashboardData}
                >
                  <i className="bi bi-search me-2"></i>
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="row g-4 mb-4">
          {/* Total de Vendas no Período */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-primary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="card-subtitle text-muted mb-0">Total de Vendas</h6>
                  <i className="bi bi-currency-dollar fs-2 text-primary"></i>
                </div>
                <h3 className="card-title text-primary mb-0">
                  {monthlyReport ? 
                    `R$ ${monthlyReport.totalSales?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}` 
                    : 'N/A'}
                </h3>
                <p className="text-muted small mb-0 mt-2">
                  Período: {new Date(dateRange.initial).toLocaleDateString('pt-BR')} - {new Date(dateRange.final).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          {/* Produto Mais Vendido */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-success">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="card-subtitle text-muted mb-0">Produto Mais Vendido</h6>
                  <i className="bi bi-trophy fs-2 text-success"></i>
                </div>
                {mostSoldProduct ? (
                  <>
                    <h5 className="card-title text-success mb-2">
                      {mostSoldProduct.productName || 'N/A'}
                    </h5>
                    <p className="text-muted mb-0">
                      <strong>{mostSoldProduct.totalSold || 0}</strong> unidades vendidas
                    </p>
                  </>
                ) : (
                  <p className="text-muted">Nenhum produto vendido</p>
                )}
              </div>
            </div>
          </div>

          {/* Produto com Menor Estoque */}
          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-warning">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="card-subtitle text-muted mb-0">Baixo Estoque</h6>
                  <i className="bi bi-exclamation-triangle fs-2 text-warning"></i>
                </div>
                {lowStockProduct ? (
                  <>
                    <h5 className="card-title text-warning mb-2">
                      {lowStockProduct.name || 'N/A'}
                    </h5>
                    <p className="text-muted mb-0">
                      Apenas <strong className="text-danger">{lowStockProduct.stockQtd || 0}</strong> unidades em estoque
                    </p>
                    <p className="text-muted small mb-0 mt-1">
                      Preço: R$ {lowStockProduct.price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                    </p>
                  </>
                ) : (
                  <p className="text-muted">Sem informações de estoque</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">
              <i className="bi bi-info-circle me-2"></i>
              Informações do Dashboard
            </h5>
          </div>
          <div className="card-body">
            <ul className="list-unstyled mb-0">
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                <strong>Total de Vendas:</strong> Soma de todas as vendas no período selecionado
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                <strong>Produto Mais Vendido:</strong> Produto com maior volume de vendas (todas as datas)
              </li>
              <li className="mb-0">
                <i className="bi bi-check-circle text-success me-2"></i>
                <strong>Baixo Estoque:</strong> Produto com menor quantidade em estoque (requer atenção)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
