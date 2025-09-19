import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { Product } from "../../types/Products";
import ProductCard from "../components/ProductCard";

const HomeView = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
         console.log(" Produtos recebidos:", data); 
        setProducts(data);
      } catch (error) {
        console.error("Erro ao carregar produtos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center mt-5">Carregando produtos...</p>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Produtos</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomeView;
