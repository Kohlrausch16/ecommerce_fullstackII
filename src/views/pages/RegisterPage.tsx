import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cpf: '',
    phoneNumber: '',
    street: '',
    number: '',
    block: '',
    city: '',
    state: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  if (!authContext) {
    throw new Error('RegisterPage must be used within an AuthProvider');
  }
  
  const { register, isAuthenticated } = authContext;
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const { name, email, password, confirmPassword, cpf, phoneNumber, street, number, block, city, state } = formData;
    
    if (!name || !email || !password || !confirmPassword || !cpf || !phoneNumber || !street || !number || !block || !city || !state) {
      setError('Por favor, preencha todos os campos.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      setSuccess('Conta criada com sucesso! Você será redirecionado para fazer login.');
      
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">
                    <i className="bi bi-person-plus-fill me-2"></i>
                    Criar Conta
                  </h2>
                  <p className="text-muted">
                    Preencha todos os campos para criar sua conta
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Dados Pessoais */}
                  <div className="mb-4">
                    <h5 className="text-secondary mb-3">
                      <i className="bi bi-person me-2"></i>
                      Dados Pessoais
                    </h5>
                    
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="Digite seu nome completo"
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="cpf" className="form-label">
                            CPF *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="cpf"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="000.000.000-00"
                            maxLength={14}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="phoneNumber" className="form-label">
                            Telefone *
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dados de Acesso */}
                  <div className="mb-4">
                    <h5 className="text-secondary mb-3">
                      <i className="bi bi-shield-lock me-2"></i>
                      Dados de Acesso
                    </h5>
                    
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                        placeholder="Digite seu email"
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">
                            Senha *
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="Digite sua senha (mín. 6 caracteres)"
                            minLength={6}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label">
                            Confirmar Senha *
                          </label>
                          <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="Confirme sua senha"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="mb-4">
                    <h5 className="text-secondary mb-3">
                      <i className="bi bi-geo-alt me-2"></i>
                      Endereço
                    </h5>
                    
                    <div className="row">
                      <div className="col-md-8">
                        <div className="mb-3">
                          <label htmlFor="street" className="form-label">
                            Rua *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="street"
                            name="street"
                            value={formData.street}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="Nome da sua rua"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label htmlFor="number" className="form-label">
                            Número *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="number"
                            name="number"
                            value={formData.number}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="block" className="form-label">
                            Bairro *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="block"
                            name="block"
                            value={formData.block}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="Nome do bairro"
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label htmlFor="city" className="form-label">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="São Paulo"
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="mb-3">
                          <label htmlFor="state" className="form-label">
                            UF *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                            placeholder="SP"
                            maxLength={2}
                            style={{ textTransform: 'uppercase' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-3">
                    <Link 
                      to="/" 
                      className="btn btn-outline-secondary flex-fill"
                      style={{ textDecoration: 'none' }}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Voltar ao Login
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary flex-fill"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Criando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-check me-2"></i>
                          Criar Conta
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <small className="text-muted">
                    Já tem uma conta? 
                    <Link to="/" className="text-primary text-decoration-none ms-1">
                      Faça login aqui
                    </Link>
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;