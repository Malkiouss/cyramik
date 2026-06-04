import { Link } from 'react-router-dom';
import studioTable from '../assets/images/studio-table.svg';

const CTASection = () => (
  <section className="cta-section">
    <div className="cta-copy">
      <span className="eyebrow">Prochaine pause creative</span>
      <h2>Un cafe, une table, une piece qui prend forme.</h2>
      <p>
        Venez seul, en duo ou en groupe. Nous preparons la matiere, les couleurs,
        les boissons et le rythme doux qui permet aux idees de respirer.
      </p>
      <div className="hero-actions">
        <Link className="btn btn-primary" to="/ceramique">Decouvrir les ateliers</Link>
        <Link className="btn btn-ghost btn-dark" to="/boutique">Acceder a la boutique</Link>
      </div>
    </div>
    <img src={studioTable} alt="Table creative avec cafe et ceramique" />
  </section>
);

export default CTASection;
