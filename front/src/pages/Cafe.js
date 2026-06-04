import ProductCard from '../components/ProductCard';
import { products } from '../data/siteData';
import './Cafe.css';

const Cafe = () => (
  <main className="page page-offset">
    <section className="page-hero">
      <span className="eyebrow">Cafe de specialite</span>
      <h1>Une carte courte, precise et reconfortante.</h1>
      <p>Espresso, filtre, matcha, boissons glacees et patisseries pensees pour accompagner les ateliers.</p>
    </section>
    <div className="menu-list">
      {['Espresso tonic', 'Flat white noisette', 'Filtre Ethiopie', 'Chai maison', 'Cookie sesame brun'].map((item, index) => (
        <div key={item}><span>{item}</span><strong>{4 + index} EUR</strong></div>
      ))}
    </div>
    <div className="cards-grid">{products.slice(1, 2).map((product) => <ProductCard key={product._id} product={product} />)}</div>
  </main>
);

export default Cafe;
