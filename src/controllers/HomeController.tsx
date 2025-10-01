  import React, { useState, useEffect } from 'react';
  import { ProductModel } from '../models/ProductModel';
  import { Product } from '../types/Products';
  import Header from '../views/components/Header';
  import HomeView from '../views/pages/HomeView';
  import AdminFloatingButton from '../views/components/AdminFloatingButton';

  const HomeController: React.FC = () => {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
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
        const safeProductsData = Array.isArray(productsData) ? productsData : [];
        setAllProducts(safeProductsData);
        setFilteredProducts(safeProductsData); // Inicialmente mostra todos
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar produtos';
        setError(errorMessage);
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleRetry = () => {
      loadProducts();
    };

    const handleSearch = (searchTerm: string) => {
      if (!searchTerm) {
        setFilteredProducts(allProducts);
      } else {
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    };

    return (
      <>
        <Header onSearch={handleSearch} />
        <HomeView
          products={filteredProducts}
          loading={loading}
          error={error}
          onRetry={handleRetry}
          onProductUpdate={loadProducts}
        />
        <AdminFloatingButton onProductAdded={loadProducts} />
      </>
    );
  };

  export default HomeController;