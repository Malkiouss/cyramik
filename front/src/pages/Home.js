import CTASection from '../components/CTASection';
import ExperienceCards from '../components/ExperienceCards';
import GalleryGrid from '../components/GalleryGrid';
import HeroSection from '../components/HeroSection';
import { socialCards } from '../data/siteData';

const Home = () => (
  <>
    <HeroSection />
    <ExperienceCards />
    <GalleryGrid />
    <section className="section social-section">
      <div className="section-heading">
        <span className="eyebrow">Inspiration</span>
        <h2>Instants Coffee Arts</h2>
      </div>
      <div className="social-card-grid">
        {socialCards.map((card) => <article key={card}>{card}</article>)}
      </div>
    </section>
    <CTASection />
  </>
);

export default Home;
