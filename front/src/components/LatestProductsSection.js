import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import './LatestProductsSection.css';

const fallbackImage = '/assets/exper3.jpg';

const getProductImage = (product) => {
  if (product.imageUrl) return product.imageUrl;
  if (Array.isArray(product.images) && product.images[0]) return product.images[0];
  return fallbackImage;
};

const formatPrice = (price) => {
  const value = Number(price);
  if (Number.isNaN(value)) return '';
  return `${value.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} EUR`;
};

const ProductPreviewCard = ({ product }) => (
  <article className="latest-product-card">
    <Link className="latest-product-image" to="/boutique" aria-label={`Voir ${product.name}`}>
      <img src={getProductImage(product)} alt={product.name} />
    </Link>
    <div className="latest-product-body">
      <div className="latest-product-head">
        <h3>{product.name}</h3>
        <strong>{formatPrice(product.price)}</strong>
      </div>
      <p>{product.description || 'L’univers Coffee Arts Paris, a emporter avec vous.'}</p>
    </div>
    <Link className="latest-product-more" to="/boutique">Voir plus</Link>
  </article>
);

const LatestProductsSection = () => {
  const { data: products = [], isLoading, isError } = useProducts();
  const latestProducts = products.filter((product) => product.isActive !== false).slice(0, 3);

  if (!isLoading && (isError || latestProducts.length === 0)) return null;

  return (
    <section className="latest-products-section">
      <div className="latest-products-header">
        <h2>Nos dernières nouveautés</h2>
        <p>L’univers Coffee Arts Paris, à emporter avec vous.</p>
      </div>

      <div className="latest-products-grid">
        {isLoading
          ? [0, 1, 2].map((item) => <div className="latest-product-card latest-product-card--loading" key={item} />)
          : latestProducts.map((product) => <ProductPreviewCard key={product.id || product._id} product={product} />)}
      </div>
    </section>
  );
};

export default LatestProductsSection;
