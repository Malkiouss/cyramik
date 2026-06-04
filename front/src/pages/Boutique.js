import ProductCard from '../components/ProductCard';
import { products } from '../data/siteData';

const Boutique = () => (
  <main className="page page-offset">
    <section className="page-hero">
      <span className="eyebrow">Boutique</span>
      <h1>Boutique</h1>
      <p>Une selection en petites series: tasses, assiettes, coffrets cafe et pieces signees du studio.</p>
    </section>
    <div className="cards-grid">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>
  </main>
);

export default Boutique;
