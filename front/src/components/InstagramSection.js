import { useEffect, useState } from 'react';
import { FaInstagram } from 'react-icons/fa';
import './InstagramSection.css';

const instagramUrl = 'https://www.instagram.com/coffeearts.paris/';
const instagramUsername = 'coffeearts.paris';
const oEmbedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(instagramUrl)}`;

const InstagramEmbedFallback = () => (
  <blockquote
    className="instagram-media"
    data-instgrm-permalink={instagramUrl}
    data-instgrm-version="14"
  >
    <a href={instagramUrl} target="_blank" rel="noreferrer">
      Voir @{instagramUsername} sur Instagram
    </a>
  </blockquote>
);

const InstagramSection = () => {
  const [embedHtml, setEmbedHtml] = useState('');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    fetch(oEmbedUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Instagram embed unavailable');
        }

        return response.json();
      })
      .then((data) => {
        if (!isMounted) return;
        setEmbedHtml(data.html || '');
        setStatus(data.html ? 'ready' : 'error');
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (status === 'loading') return;

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
  }, [embedHtml, status]);

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
          @{instagramUsername}
        </a>
      </div>

      <article className="instagram-card">
        <div className="instagram-profile">
          <span className="instagram-profile-icon" aria-hidden="true">
            <FaInstagram />
          </span>
          <div>
            <p className="instagram-profile-label">Instagram</p>
            <h3>@{instagramUsername}</h3>
          </div>
          <a
            className="instagram-follow"
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            Follow
          </a>
        </div>

        <div
          className="instagram-widget"
          aria-busy={status === 'loading'}
        >
          {status === 'loading' && (
            <p className="instagram-state">Chargement du feed Instagram...</p>
          )}

          {status === 'ready' && (
            <div
              className="instagram-embed"
              dangerouslySetInnerHTML={{ __html: embedHtml }}
            />
          )}

          {status === 'error' && (
            <>
              <InstagramEmbedFallback />
              <div className="instagram-fallback">
                <p>Si le feed ne se charge pas, ouvrez le profil directement sur Instagram.</p>
                <a href={instagramUrl} target="_blank" rel="noreferrer">
                  Voir @{instagramUsername} sur Instagram
                </a>
              </div>
            </>
          )}
        </div>
      </article>
    </section>
  );
};

export default InstagramSection;
