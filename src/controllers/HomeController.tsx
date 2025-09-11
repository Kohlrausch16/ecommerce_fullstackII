import React, { useState, useEffect } from 'react';
import { ProductModel } from '../models/ProductModel';
import HomeView from '../views/pages/HomeView';

const HomeController: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const productsData = await ProductModel.getAll();
      setProducts(productsData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    loadProducts();
  };

  return (
    <HomeView
      products={products}
      loading={loading}
      error={error}
      onRetry={handleRetry}
    />
  );
};

export default HomeController;