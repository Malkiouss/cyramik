import { useEffect } from 'react';
import './InstagramSection.css';

const instagramUrl = 'https://www.instagram.com/coffeearts.paris/';

const InstagramSection = () => {
  useEffect(() => {
    const processEmbed = () => window.instgrm?.Embeds?.process?.();
    const existingScript = document.querySelector('script[src="//www.instagram.com/embed.js"], script[src="https://www.instagram.com/embed.js"]');

    if (existingScript) {
      processEmbed();
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.onload = processEmbed;
    document.body.appendChild(script);
  }, []);

  return (
    <section className="instagram-section" aria-labelledby="instagram-title">
      <div className="instagram-heading">
        <h2 id="instagram-title">Instants Coffee Arts Paris</h2>
        <p>
          Nos dernieres inspirations, nos moments creatifs et la vie du cafe a retrouver sur Instagram.
        </p>
        <a
          className="instagram-handle"
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
        >
          @coffeearts.paris
        </a>
      </div>

      <div className="instagram-widget">
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={instagramUrl}
          data-instgrm-version="14"
        >
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            Voir Coffee Arts Paris sur Instagram
          </a>
        </blockquote>
      </div>
    </section>
  );
};

export default InstagramSection;
