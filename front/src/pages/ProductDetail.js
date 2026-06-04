import { Link, useLocation, useParams } from 'react-router-dom';
import { getProductImage, formatProductPrice } from '../components/ProductCard';
import { useProduct } from '../hooks/useProducts';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { data: product, isLoading, isError } = useProduct(id);
  const isCeramique = pathname.startsWith('/ceramique');
  const backPath = isCeramique ? '/ceramique' : '/boutique';
  const backLabel = isCeramique ? 'Retour ceramique' : 'Retour boutique';

  if (isLoading) {
    return (
      <main className="product-detail-page page-offset">
        <div className="product-detail-shell product-detail-shell--loading" />
      </main>
    );
  }

  if (isError || !product) {
    return (
      <main className="product-detail-page page-offset">
        <section className="product-detail-empty">
          <span className="eyebrow">{isCeramique ? 'Ceramique' : 'Boutique'}</span>
          <h1>Produit introuvable</h1>
          <p>Ce produit n'est plus disponible ou n'existe pas.</p>
          <Link className="btn btn-primary" to={backPath}>{backLabel}</Link>
        </section>
      </main>
    );
  }

  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : [getProductImage(product)];
  const stock = Number(product.stock || 0);

  return (
    <main className="product-detail-page page-offset">
      <section className="product-detail-shell">
        <div className="product-detail-gallery">
          <img className="product-detail-main-image" src={images[0]} alt={product.name} />
          {images.length > 1 && (
            <div className="product-detail-thumbs">
              {images.slice(1, 4).map((image) => (
                <img key={image} src={image} alt={`${product.name} detail`} />
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-copy">
          <Link className="product-detail-back" to={backPath}>{backLabel}</Link>
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <strong>{formatProductPrice(product.price)}</strong>
          <p>{product.description || 'Piece artisanale en petite serie, pensee pour les rituels du quotidien.'}</p>
          <div className="product-detail-meta">
            <span>{stock > 0 ? `${stock} en stock` : 'Rupture de stock'}</span>
            <span>Retrait ou livraison selon disponibilite</span>
          </div>
          {stock > 0
            ? <Link className="btn btn-primary" to="/contact">Demander ce produit</Link>
            : <button className="btn btn-primary" type="button" disabled>Indisponible</button>}
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
