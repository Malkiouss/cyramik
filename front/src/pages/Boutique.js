import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

const Boutique = () => {
  const { data: products = [], isLoading, isError } = useProducts();
  const activeProducts = products.filter((product) => product.isActive !== false && product.category !== 'ceramique');

  return (
    <main className="page page-offset">
      <section className="page-hero">
        <span className="eyebrow">Boutique</span>
        <h1>Boutique</h1>
        <p>Une selection en petites series: coffrets cafe, goodies et objets lifestyle signes du studio.</p>
      </section>

      {!isLoading && isError && <p className="page-message">Impossible de charger les produits pour le moment.</p>}
      {!isLoading && !isError && activeProducts.length === 0 && <p className="page-message">Aucun produit disponible pour le moment.</p>}
      {!isLoading && !isError && activeProducts.length > 0 && (
        <div className="cards-grid">
          {activeProducts.map((product) => <ProductCard key={product.id || product._id} product={product} />)}
        </div>
      )}
    </main>
  );
};

export default Boutique;
