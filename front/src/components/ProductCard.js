import './ProductCard.css';

const ProductCard = ({ product }) => (
  <article className="item-card product-card">
    <img src={product.imageUrl} alt={product.name} />
    <div>
      <span>{product.category}</span>
      <h3>{product.name}</h3>
      <p>{product.description || 'Piece artisanale en petite serie, pensee pour les rituels du quotidien.'}</p>
      <strong>{product.price} EUR</strong>
    </div>
  </article>
);

export default ProductCard;
