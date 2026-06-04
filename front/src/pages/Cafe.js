import './Cafe.css';

const Cafe = () => (
  <main className="cafe-page page-offset">
    <section className="cafe-hero">
      <span className="eyebrow1"></span>
      <h1>La carte</h1>
      <p>Une sélection pensée autour du café, du fait-maison et du plaisir de partager.</p>
    </section>

    <section className="cafe-menu" aria-label="Carte Coffee Arts Paris">
      <figure>
        <img src="/cart/new1.png" alt="Carte cafe, matcha et autres boissons Coffee Arts Paris" />
      </figure>
      <figure>
        <img src="/cart/new2.png" alt="Carte pastry et snack Coffee Arts Paris" />
      </figure>
    </section>

    <section className="cafe-details">
      <div className="section-heading">
        <span className="eyebrow">Nos cafes</span>
        <h2>Des cafes de specialite prepares avec attention.</h2>
        <p>Nous selectionnons nos cafes avec soin et adaptons chaque extraction pour reveler au mieux les aromes, l'equilibre et la douceur de chaque tasse.</p>
      </div>

      <div className="cafe-info-grid">
        <article>
          <h3>Origine des cafes</h3>
          <p>Une selection de cafes de specialite choisie pour sa qualite, sa tracabilite et son respect du produit.</p>
        </article>
        <article>
          <h3>Preparation & extraction</h3>
          <p>Espresso, boissons glacees, matcha ou latte signature: chaque recette est preparee pour etre douce, lisible et genereuse.</p>
        </article>
        <article>
          <h3>Sur place</h3>
          <p>Installez-vous pour une pause cafe, une patisserie maison ou un snack avant de profiter de l'atelier ceramique.</p>
        </article>
      </div>
    </section>
  </main>
);

export default Cafe;
