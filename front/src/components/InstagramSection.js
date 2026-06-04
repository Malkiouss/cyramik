import { FaInstagram } from 'react-icons/fa';
import ceramic from '../assets/images/ceramic.svg';
import { instagramPosts } from '../data/siteData';

const InstagramSection = () => (
  <section className="instagram-section" aria-labelledby="instagram-title">
    <div className="instagram-heading">
      <h2 id="instagram-title">Instants Coffee Arts Paris</h2>
      <p>
        Nos dernieres inspirations, nos moments creatifs et la vie du cafe a retrouver sur Instagram.
      </p>
      <a
        className="instagram-handle"
        href="https://www.instagram.com/coffeearts.paris/"
        target="_blank"
        rel="noreferrer"
      >
        @coffeearts.paris
      </a>
    </div>

    <div className="instagram-frame">
      <div className="instagram-profile">
        <div className="instagram-avatar">
          <img src={ceramic} alt="Logo Coffee Arts Paris" />
        </div>
        <div className="instagram-meta">
          <strong>coffeearts.paris</strong>
          <span>COFFEE ARTS PARIS</span>
          <span>7,579 followers</span>
          <span>59 posts</span>
        </div>
        <FaInstagram className="instagram-icon" aria-hidden="true" />
      </div>

      <div className="instagram-grid" aria-label="Apercu des publications Instagram">
        {instagramPosts.map((post, index) => (
          <a
            className="instagram-post"
            href="https://www.instagram.com/coffeearts.paris/"
            target="_blank"
            rel="noreferrer"
            key={`${post.alt}-${index}`}
            aria-label="Voir Coffee Arts Paris sur Instagram"
          >
            <img src={post.image} alt={post.alt} />
            <span aria-hidden="true" />
          </a>
        ))}
      </div>
    </div>
  </section>
);

export default InstagramSection;
