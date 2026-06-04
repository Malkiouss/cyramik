import { FaInstagram, FaPinterestP, FaTiktok } from 'react-icons/fa';

const SocialFloatingButtons = () => (
  <div className="social-floating" aria-label="Social links">
    <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
    <a href="https://tiktok.com" aria-label="TikTok"><FaTiktok /></a>
    <a href="https://pinterest.com" aria-label="Pinterest"><FaPinterestP /></a>
  </div>
);

export default SocialFloatingButtons;
