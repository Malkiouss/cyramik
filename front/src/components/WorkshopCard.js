import { Link } from 'react-router-dom';

const WorkshopCard = ({ workshop }) => (
  <article className="item-card workshop-card">
    <img src={workshop.imageUrl} alt={workshop.title} />
    <div>
      <span>{workshop.level} · {workshop.duration}</span>
      <h3>{workshop.title}</h3>
      <p>{workshop.description}</p>
      <strong>{workshop.price} EUR</strong>
      <Link className="text-link" to="/contact">Reserver</Link>
    </div>
  </article>
);

export default WorkshopCard;
