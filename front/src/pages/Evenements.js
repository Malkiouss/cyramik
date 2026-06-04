import { events } from '../data/siteData';

const Evenements = () => (
  <main className="page page-offset">
    <section className="page-hero">
      <span className="eyebrow">Evenements</span>
      <h1>Soirees creatives, brunchs et privatisations.</h1>
      <p>Des rendez-vous chaleureux pour celebrer, apprendre et partager autour d une table.</p>
    </section>
    <div className="cards-grid">
      {events.map((event) => (
        <article className="item-card" key={event._id}>
          <img src={event.imageUrl} alt={event.title} />
          <div>
            <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </div>
        </article>
      ))}
    </div>
  </main>
);

export default Evenements;
