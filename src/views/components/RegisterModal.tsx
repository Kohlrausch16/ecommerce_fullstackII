import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface RegisterModalProps {
  show: boolean;
  onHide: () => void;
  onSwitchToLogin: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ show, onHide, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [block, setBlock] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !confirmPassword || !cpf || !phoneNumber || !street || !number || !block || !city || !state) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await register({ 
        name, 
        email, 
        password, 
        confirmPassword, 
        cpf, 
        phoneNumber, 
        street, 
        number, 
        block, 
        city, 
        state 
      });
      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        onSwitchToLogin();
        setTimeout(() => {
          handleClose();
        }, 100);
      }, 1500);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta. Tente novamente.';
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setCpf('');
    setPhoneNumber('');
    setStreet('');
    setNumber('');
    setBlock('');
    setCity('');
    setState('');
    setError('');
    setSuccess('');
    onHide();
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent', zIndex: show ? 1070 : -1 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-plus-fill me-2"></i>
              TESTE - FORMULÁRIO COMPLETO
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={handleClose}
              disabled={loading}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
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
              
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  <i className="bi bi-person me-2"></i>
                  Nome Completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Digite seu nome completo"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="registerEmail" className="form-label">
                  <i className="bi bi-envelope me-2"></i>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="registerEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Digite seu email"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="registerPassword" className="form-label">
                  <i className="bi bi-lock me-2"></i>
                  Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="registerPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Digite sua senha (mín. 6 caracteres)"
                  minLength={6}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  <i className="bi bi-lock-fill me-2"></i>
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Confirme sua senha"
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="cpf" className="form-label">
                      <i className="bi bi-card-text me-2"></i>
                      CPF
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cpf"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
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
                      <i className="bi bi-telephone me-2"></i>
                      Telefone
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-8">
                  <div className="mb-3">
                    <label htmlFor="street" className="form-label">
                      <i className="bi bi-geo-alt me-2"></i>
                      Rua
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Nome da sua rua"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="number" className="form-label">
                      <i className="bi bi-hash me-2"></i>
                      Número
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
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
                      <i className="bi bi-building me-2"></i>
                      Bairro
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="block"
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="Nome do bairro"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                      <i className="bi bi-pin-map me-2"></i>
                      Cidade
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="São Paulo"
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="mb-3">
                    <label htmlFor="state" className="form-label">
                      UF
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      disabled={loading}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    Já tem conta? 
                    <button 
                      type="button" 
                      className="btn btn-link p-0 ms-1"
                      onClick={onSwitchToLogin}
                      disabled={loading}
                    >
                      Faça login
                    </button>
                  </small>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    type="button" 
                    className="btn btn-secondary flex-fill" 
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
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
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;