import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { Product } from '../../types/Products';
import { ProductModel } from '../../models/ProductModel';

interface Props {
  show: boolean;
  onHide: () => void;
  onProductSaved: () => void;
  product?: Product | null;
}

const ProductFormModal: React.FC<Props> = ({ show, onHide, onProductSaved, product }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    height: 0,
    width: 0,
    length: 0,
    color: '',
    description: '',
    status: true,
    year: new Date().getFullYear()
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isEditing = !!product;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        height: product.height,
        width: product.width,
        length: product.length,
        color: product.color.join(', '),
        description: product.description,
        status: product.status,
        year: new Date(product.createdAt).getFullYear()
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        price: 0,
        height: 0,
        width: 0,
        length: 0,
        color: '',
        description: '',
        status: true,
        year: new Date().getFullYear()
      });
    }
    setError(null);
  }, [product, show]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Preparar dados apenas com o que o usuário preencheu
      const productData = {
        name: formData.name,
        price: formData.price,
        height: formData.height,
        width: formData.width,
        length: formData.length,
        color: formData.color.split(',').map(c => c.trim()).filter(c => c),
        description: formData.description,
        status: formData.status,
        year: formData.year
      };

      if (isEditing && product) {
        // Atualizar produto existente
        await ProductModel.update(product.id, productData);
      } else {
        // Criar novo produto - backend gera ID, timestamps, etc.
        await ProductModel.create(productData);
      }

      onProductSaved();
      onHide();
    } catch (error: any) {
      setError(error.message || 'Erro ao salvar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Row className="mb-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Nome do Produto *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Relógio Clássico Dourado"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Preço (R$) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Altura (cm) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Largura (cm) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  name="width"
                  value={formData.width}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Comprimento (cm) *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  min="0"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Cores Disponíveis</Form.Label>
                <Form.Control
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Ex: Dourado, Prateado, Preto (separar por vírgula)"
                />
                <Form.Text className="text-muted">
                  Separe as cores por vírgula
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}
                >
                  <option value="true">Disponível</option>
                  <option value="false">Indisponível</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Descrição *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Descreva as características, material, funcionalidades..."
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || !formData.name || formData.price <= 0}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                {isEditing ? 'Salvando...' : 'Criando...'}
              </>
            ) : (
              isEditing ? 'Salvar Alterações' : 'Criar Produto'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ProductFormModal;