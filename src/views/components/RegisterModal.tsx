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
  const [error, setError] = useState('');
  const { register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
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
      await register({ name, email, password, confirmPassword });
      handleClose();
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
    setError('');
    onHide();
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent', zIndex: show ? 1070 : -1 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-plus-fill me-2"></i>
              Criar Conta
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