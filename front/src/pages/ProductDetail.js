import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { getProductImage, formatProductPrice } from '../components/ProductCard';
import { useAuth } from '../hooks/useAuth';
import { useProduct } from '../hooks/useProducts';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { data: product, isLoading, isError } = useProduct(id);
  const { user, getMe } = useAuth();
  const [reservation, setReservation] = useState({ customerName: '', customerEmail: '', customerPhone: '', quantity: 1, customerNote: '' });
  const [reservationStatus, setReservationStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const isCeramique = pathname.startsWith('/ceramique');
  const backPath = isCeramique ? '/ceramique' : '/boutique';
  const backLabel = isCeramique ? 'Retour ceramique' : 'Retour boutique';

  useEffect(() => {
    if (!user) return;

    setReservation((current) => ({
      ...current,
      customerName: user.name || current.customerName,
      customerEmail: user.email || current.customerEmail,
    }));
  }, [user]);

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

  const reserveProduct = async (event) => {
    event.preventDefault();

    if (getMe.isLoading) return;

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
      return;
    }

    setSubmitting(true);
    setReservationStatus({ type: '', message: '' });
    try {
      await api.post('/orders/reservations', {
        ...reservation,
        productId: product.id || product._id,
        quantity: Number(reservation.quantity || 1),
      });
      setReservation({
        customerName: user.name || '',
        customerEmail: user.email || '',
        customerPhone: '',
        quantity: 1,
        customerNote: '',
      });
      setReservationStatus({ type: 'success', message: 'Reservation envoyee. Nous vous confirmerons la disponibilite rapidement.' });
    } catch (error) {
      if (error.response?.status === 401) {
        navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
        return;
      }

      setReservationStatus({ type: 'error', message: error.response?.data?.message || 'Reservation impossible pour le moment.' });
    } finally {
      setSubmitting(false);
    }
  };

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
          {stock > 0 ? (
            <form className="product-reservation-form" onSubmit={reserveProduct}>
              <h2>Reserver ce produit</h2>
              {user ? (
                <p className="product-reservation-account">Connecte en tant que <strong>{user.email}</strong></p>
              ) : (
                <p className="product-reservation-account">Connectez-vous pour reserver ce produit.</p>
              )}
              <div className="product-reservation-grid">
                <input
                  value={reservation.customerPhone}
                  onChange={(event) => setReservation({ ...reservation, customerPhone: event.target.value })}
                  placeholder="Telephone"
                  required
                />
                <input
                  type="number"
                  min="1"
                  max={stock}
                  value={reservation.quantity}
                  onChange={(event) => setReservation({ ...reservation, quantity: event.target.value })}
                  placeholder="Quantite"
                  required
                />
              </div>
              <textarea
                value={reservation.customerNote}
                onChange={(event) => setReservation({ ...reservation, customerNote: event.target.value })}
                placeholder="Message optionnel"
                rows="3"
              />
              {reservationStatus.message && <p className={`product-reservation-message is-${reservationStatus.type}`}>{reservationStatus.message}</p>}
              <button className="btn btn-primary" type="submit" disabled={submitting || getMe.isLoading}>
                {!user ? 'Se connecter pour reserver' : submitting ? 'Envoi...' : 'Reserver'}
              </button>
            </form>
          ) : (
            <button className="btn btn-primary" type="button" disabled>Indisponible</button>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
