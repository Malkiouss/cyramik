import { Link } from 'react-router-dom';
import './ProductCard.css';

const fallbackImage = '/assets/exper3.jpg';

export const getProductImage = (product) => {
  if (product.imageUrl) return product.imageUrl;
  if (Array.isArray(product.images) && product.images[0]) return product.images[0];
  return fallbackImage;
};

export const formatProductPrice = (price) => {
  const value = Number(price);
  if (Number.isNaN(value)) return '';
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} EUR`;
};

const ProductCard = ({ product, detailBasePath = '/boutique' }) => (
  <Link className="item-card product-card" to={`${detailBasePath}/${product.id || product._id}`}>
    <img src={getProductImage(product)} alt={product.name} />
    <div>
      <span>{product.category}</span>
      <h3>{product.name}</h3>
      <p>{product.description || 'Piece artisanale en petite serie, pensee pour les rituels du quotidien.'}</p>
      <strong>{formatProductPrice(product.price)}</strong>
    </div>
  </Link>
);

export default ProductCard;
