import BookingForm from '../components/BookingForm';
import ProductCard from '../components/ProductCard';
import WorkshopCard from '../components/WorkshopCard';
import { useProducts } from '../hooks/useProducts';
import { workshops } from '../data/siteData';
import './Ceramique.css';

const galleryImages = [
  {
    src: 'https://www.coffeeartsparis.fr/jennifer-burk-CHG8eMpD1Aw-unsplash.jpg?dpl=dpl_A5Yyw1iCyTThhPyjQaoECDWpEWYa',
    alt: 'Atelier de ceramique avec pieces en cours de sechage',
  },
  {
    src: 'https://www.coffeeartsparis.fr/pic2.png?dpl=dpl_A5Yyw1iCyTThhPyjQaoECDWpEWYa',
    alt: 'Tasse Coffee Arts Paris dans l atelier',
  },
];

const Ceramique = () => {
  const { data: products = [], isLoading, isError } = useProducts({ category: 'ceramique' });
  const ceramicProducts = products.filter((product) => product.isActive !== false && product.category === 'ceramique');

  return (
    <main className="ceramique-page page-offset">
      <section className="ceramique-hero">
        <span className="eyebrow">Nos ateliers</span>
        <h1>Nos ateliers</h1>
        <p>Des ateliers de ceramique pour explorer la matiere, s'initier aux gestes et vivre une experience creative, au rythme de chacun.</p>
      </section>

      <section className="ceramique-products-section">
        <div className="section-heading">
          <span className="eyebrow">Pieces en ceramique</span>
          <h2>Les pieces disponibles du studio.</h2>
          <p>Tasses, assiettes et objets artisanaux en petites series.</p>
        </div>

        {isLoading && <div className="cards-grid">{[0, 1, 2].map((item) => <span className="item-card product-card product-card--loading" key={item} />)}</div>}
        {!isLoading && isError && <p className="page-message">Impossible de charger les pieces en ceramique pour le moment.</p>}
        {!isLoading && !isError && ceramicProducts.length === 0 && <p className="page-message">Aucune piece en ceramique disponible pour le moment.</p>}
        {!isLoading && !isError && ceramicProducts.length > 0 && (
          <div className="cards-grid">
            {ceramicProducts.map((product) => <ProductCard key={product.id || product._id} product={product} detailBasePath="/ceramique" />)}
          </div>
        )}
      </section>

    <section className="ceramique-booking-section">
      <div>
        <p className="ceramique-kicker">Standard Iftar at Coffee Art Paris</p>
        <div className="ceramique-workshops">
          {workshops.map((workshop) => <WorkshopCard key={workshop._id} workshop={workshop} />)}
        </div>
      </div>
      <BookingForm workshops={workshops} />
    </section>

    <section className="ceramique-story">
      <div className="ceramique-copy">
        <span className="eyebrow">Envie de nouvelles idees ?</span>
        <h2>L'atelier de ceramique est un espace ouvert a celles et ceux qui souhaitent decouvrir la matiere.</h2>
        <p>Peinture sur ceramique, modelage ou initiation a la poterie : chaque atelier est pense comme un moment accessible, guide et sans pression.</p>
        <p>Que vous veniez pour la premiere fois ou que vous ayez deja pratique, l'accompagnement se fait pas a pas, dans une atmosphere conviviale.</p>
        <p>L'objectif n'est pas la performance, mais le plaisir de creer, d'apprendre et de prendre le temps.</p>
        <p>Les ateliers se deroulent en petits groupes, afin de garantir une experience attentive et personnalisee pour chaque participant.</p>
      </div>
      <img src={galleryImages[0].src} alt={galleryImages[0].alt} />
    </section>

    <section className="ceramique-experience">
      <div className="section-heading">
        <span className="eyebrow">Une experience pour tous</span>
        <h2>Chaque atelier est pense pour etre fluide, structure et accessible.</h2>
      </div>

      <div className="ceramique-values">
        <article>
          <h3>Ouvert a tous les niveaux</h3>
          <p>Les ateliers sont ouverts aux debutants comme aux personnes ayant deja pratique. Chacun avance a son rythme, accompagne pas a pas, sans prerequis.</p>
        </article>
        <article>
          <h3>En petits groupes</h3>
          <p>Les sessions se deroulent en groupes reduits afin de garantir un accompagnement attentif. Un cadre propice a l'echange, a la concentration et au plaisir de creer.</p>
        </article>
        <article>
          <h3>Une experience encadree</h3>
          <p>Chaque atelier est pense pour etre fluide, structure et accessible. Le geste, la matiere et le plaisir de creer restent au coeur de la pratique.</p>
        </article>
      </div>
    </section>

    <section className="ceramique-gallery" aria-label="Galerie ceramique Coffee Arts Paris">
      {galleryImages.map((image) => (
        <img key={image.src} src={image.src} alt={image.alt} />
      ))}
      {galleryImages.map((image) => (
        <img key={`${image.src}-repeat`} src={image.src} alt={image.alt} />
      ))}
    </section>
  </main>
  );
};

export default Ceramique;
