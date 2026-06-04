import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SocialFloatingButtons from './SocialFloatingButtons';
import './HeroSection.css';

const HeroSection = () => (
  <section className="hero">
    <video className="hero-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true">
      <source src="https://res.cloudinary.com/dylxqjhjj/video/upload/v1780561679/Caf%C3%A9_c%C3%A9ramique_sur_Paris_-_Coffee_Arts_Paris_qlylt6.mov" />
    </video>
    <div className="hero-overlay" />
    <SocialFloatingButtons />
    <motion.div
      className="hero-content"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <p className="eyebrow">Cafe ceramique a Paris</p>
      <h1>Specialty Coffee & Pottery Studio</h1>
      <h2>Sip, create and connect</h2>
      <p>
        Un lieu chaleureux pour boire un cafe de specialite, faconner une piece unique,
        decouvrir des objets artisanaux et prendre le temps.
      </p>
      <span className="address">12 rue des Ateliers, 75011 Paris</span>
      <div className="hero-actions">
        <Link className="btn btn-primary" to="/ceramique">Reserver un atelier</Link>
        <Link className="btn btn-ghost" to="/cafe">Decouvrir la carte</Link>
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
