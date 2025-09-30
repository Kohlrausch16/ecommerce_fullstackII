import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface LoginModalProps {
  show: boolean;
  onHide: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ show, onHide, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await login({ email, password });
      setEmail('');
      setPassword('');
      onHide();
      navigate('/'); // Redireciona para a home após login bem-sucedido
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login. Verifique suas credenciais.';
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    onHide();
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent', zIndex: show ? 1070 : -1 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person-circle me-2"></i>
              LOGIN MODAL - TESTE
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
                <label htmlFor="email" className="form-label">
                  <i className="bi bi-envelope me-2"></i>
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Digite seu email"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  <i className="bi bi-lock me-2"></i>
                  Senha
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Digite sua senha"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex flex-column">
                <small className="text-muted mb-2">
                  Não tem conta? 
                  <button 
                    type="button" 
                    className="btn btn-link p-0 ms-1"
                    onClick={onSwitchToRegister}
                    disabled={loading}
                  >
                    Cadastre-se
                  </button>
                </small>
                <small className="text-info">
                  <i className="bi bi-info-circle me-1"></i>
                  Dica: Emails com "admin" no nome têm privilégios administrativos
                </small>
              </div>
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
                        Entrando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Entrar
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

export default LoginModal;