import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { experiences } from '../data/siteData';
import './ExperienceCards.css';

const ExperienceCards = () => (
  <section className="section">
    <div className="section-heading">
      <span className="eyebrow">Experiences</span>
      <h2>Trois experiences, un meme lieu</h2>
      <p>
        Passez du cafe a la ceramique, puis a la boutique, dans un parcours doux et inspire.
      </p>
    </div>
    <div className="experience-grid">
      {experiences.map((item, index) => (
        <motion.article
          className="experience-card"
          key={item.label}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: index * 0.08 }}
        >
          <img src={item.image} alt="" />
          <div className="card-shade" />
          <div>
            <span>{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <Link to={item.path}>Explorer</Link>
          </div>
        </motion.article>
      ))}
    </div>
  </section>
);

export default ExperienceCards;
