import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import clientService from '../../services/clientService';

interface EditProfileData {
  firstName: string;
  lastName: string;
  email: string;
  cpf: string;
  phoneNumber: string;
  password: string;
  activeStatus: boolean;
  adress: {
    street: string;
    number: string;
    block: string;
    city: string;
    state: string;
  };
}

const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<EditProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    cpf: '',
    phoneNumber: '',
    password: '',
    activeStatus: true,
    adress: {
      street: '',
      number: '',
      block: '',
      city: '',
      state: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const authContext = useContext(AuthContext);
  
  useEffect(() => {
    if (authContext?.user) {
      // Dividir o nome em firstName e lastName
      const nameParts = (authContext.user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: authContext.user.email || '',
        cpf: '74185296300', // Exemplo do Postman
        phoneNumber: '11992345678', // Exemplo do Postman
        password: 'senhaAtual123', // Senha deve ser fornecida
        activeStatus: true,
        adress: {
          street: 'Rua das Laranjeiras',
          number: '88',
          block: 'Jardim Paulista',
          city: 'São Paulo',
          state: 'SP'
        }
      });
    }
  }, [authContext?.user]);

  if (!authContext) {
    throw new Error('ProfilePage must be used within an AuthProvider');
  }
  
  const { user, isAuthenticated } = authContext;
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('adress.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        adress: {
          ...formData.adress,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    setError(''); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      setError('Usuário não encontrado');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');

    // Validações básicas
    const { firstName, lastName, email, cpf, phoneNumber, password } = formData;
    
    if (!firstName || !lastName || !email || !cpf || !phoneNumber || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      setLoading(false);
      return;
    }

    try {
      const updateData = formData;
      
      await clientService.updateProfile(user.id, updateData);
      
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
      
    } catch (err: unknown) {
      let errorMessage = 'Erro ao atualizar perfil. Tente novamente.';
      
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: unknown; status?: number } };
        
        if (axiosError.response?.data) {
          errorMessage = typeof axiosError.response.data === 'string' 
            ? axiosError.response.data 
            : (axiosError.response.data as { message?: string }).message || errorMessage;
        }
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar dados originais
    if (user) {
      const nameParts = (user.name || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData({
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        cpf: '74185296300',
        phoneNumber: '11992345678',
        password: 'senhaAtual123',
        activeStatus: true,
        adress: {
          street: 'Rua das Laranjeiras',
          number: '88',
          block: 'Jardim Paulista',
          city: 'São Paulo',
          state: 'SP'
        }
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="fw-bold text-primary mb-1">
                      <i className="bi bi-person-circle me-2"></i>
                      Meu Perfil
                    </h2>
                    <p className="text-muted mb-0">
                      {user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </p>
                  </div>
                  <Link to="/home" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Voltar
                  </Link>
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
                  {/* Dados Básicos */}
                  <div className="mb-4">
                    <h5 className="text-secondary mb-3">
                      <i className="bi bi-person me-2"></i>
                      Informações Básicas
                    </h5>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="firstName" className="form-label">
                            Primeiro Nome *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing || loading}
                            placeholder="Digite seu primeiro nome"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="lastName" className="form-label">
                            Sobrenome *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing || loading}
                            placeholder="Digite seu sobrenome"
                          />
                        </div>
                      </div>
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
                            disabled={!isEditing || loading}
                            placeholder="000.000.000-00"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="phoneNumber" className="form-label">
                            Telefone *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing || loading}
                            placeholder="(11) 99999-9999"
                          />
                        </div>
                      </div>
                    </div>

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
                        disabled={!isEditing || loading}
                        placeholder="Digite seu email"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Nova Senha *
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={!isEditing || loading}
                        placeholder="Digite uma nova senha"
                      />
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
                            name="adress.street"
                            value={formData.adress.street}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing || loading}
                            placeholder="Digite o nome da rua"
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
                            name="adress.number"
                            value={formData.adress.number}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing || loading}
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
                            name="adress.block"
                            value={formData.adress.block}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing || loading}
                            placeholder="Digite o bairro"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label htmlFor="city" className="form-label">
                            Cidade *
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="city"
                            name="adress.city"
                            value={formData.adress.city}
                            onChange={handleInputChange}
                            required
                            disabled={!isEditing || loading}
                            placeholder="Digite a cidade"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="mb-3">
                        <label htmlFor="state" className="form-label">
                          Estado *
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          name="adress.state"
                          value={formData.adress.state}
                          onChange={handleInputChange}
                          required
                          disabled={!isEditing || loading}
                          placeholder="SP"
                          maxLength={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Informações do Sistema */}
                  <div className="mb-4">
                    <h5 className="text-secondary mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Informações do Sistema
                    </h5>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Tipo de Usuário</label>
                          <input
                            type="text"
                            className="form-control"
                            value={user?.role === 'admin' ? 'Administrador' : 'Cliente'}
                            disabled
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Data de Cadastro</label>
                          <input
                            type="text"
                            className="form-control"
                            value="N/A"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botões de Ação */}
                  <div className="d-flex gap-3">
                    {!isEditing ? (
                      <button
                        type="button"
                        className="btn btn-primary flex-fill"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Editar Perfil
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-secondary flex-fill"
                          onClick={handleCancel}
                          disabled={loading}
                        >
                          <i className="bi bi-x-circle me-2"></i>
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="btn btn-success flex-fill"
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
                              Salvar Alterações
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </form>

                {/* Links Adicionais */}
                <div className="text-center mt-4 pt-3 border-top">
                  <small className="text-muted">
                    Precisa de mais opções? 
                    <Link to="/home" className="text-primary text-decoration-none ms-1">
                      Voltar ao sistema
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

export default ProfilePage;