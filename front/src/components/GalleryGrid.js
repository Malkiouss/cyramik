import { galleryImages } from '../data/siteData';

const GalleryGrid = () => (
  <section className="section gallery-section">
    <div className="section-heading">
      <span className="eyebrow">Studio</span>
      <h2>Au coeur de notre studio</h2>
    </div>
    <div className="gallery-grid">
      {galleryImages.map((image, index) => (
        <img key={`${image}-${index}`} src={image} alt={`Studio Cyramik ${index + 1}`} />
      ))}
    </div>
  </section>
);

export default GalleryGrid;
