import { motion } from 'framer-motion';

const PhotoCard = ({ src, index, isInView }) => (
  <motion.article
    className="gallery-photo-card"
    initial={{ opacity: 0, scale: 0.92 }}
    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
    transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{
      scale: 1.04,
      boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      filter: 'brightness(1.05)',
      transition: { type: 'spring', stiffness: 260, damping: 22 },
    }}
  >
    <img src={src} alt={`Coffee Arts Paris ambience ${index + 1}`} />
    <motion.div
      className="gallery-photo-overlay"
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    />
  </motion.article>
);

export default PhotoCard;
