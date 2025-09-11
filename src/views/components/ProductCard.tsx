import React from 'react';
import { Product } from '../../types/Products';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  

  return (
    <div className="col-md-4">
        <h1>ADD PRODUTO</h1>
    </div>
  );
};

export default ProductCard;