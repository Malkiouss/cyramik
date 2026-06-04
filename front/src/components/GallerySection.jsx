import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import PhotoCard from './PhotoCard';
import './gallery.css';

const defaultImages = [
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
  'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400',
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
  'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
];

const GallerySection = ({ images = defaultImages }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      className="coffee-gallery-section"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <header className="coffee-gallery-header">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Au cœur de Coffee Arts Paris
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          Des images pour découvrir l'ambiance du lieu, ses matières, et les instants qui s'y vivent au quotidien.
        </motion.p>
      </header>

      <div className="coffee-gallery-grid">
        {images.slice(0, 8).map((src, index) => (
          <PhotoCard key={`${src}-${index}`} src={src} index={index} isInView={isInView} />
        ))}
      </div>
    </motion.section>
  );
};

export default GallerySection;
