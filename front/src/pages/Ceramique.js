import BookingForm from '../components/BookingForm';
import WorkshopCard from '../components/WorkshopCard';
import { workshops } from '../data/siteData';

const Ceramique = () => (
  <main className="page page-offset two-column">
    <section>
      <div className="page-hero compact">
        <span className="eyebrow">Ceramique / Workshops</span>
        <h1>Des ateliers pour explorer la matiere a votre rythme.</h1>
        <p>Modelage, peinture, email, soirees privees et formats pour equipes.</p>
      </div>
      <div className="cards-grid">{workshops.map((workshop) => <WorkshopCard key={workshop._id} workshop={workshop} />)}</div>
    </section>
    <BookingForm workshops={workshops} />
  </main>
);

export default Ceramique;
