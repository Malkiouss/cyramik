import { Link } from 'react-router-dom';
import { FaCcAmex, FaCcMastercard, FaCcVisa } from 'react-icons/fa';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div>
      <Link className="brand brand--footer" to="/">Cyramik</Link>
      <p>Specialty coffee, ateliers ceramique et objets sensibles pour la maison.</p>
    </div>
    <div>
      <h4>Decouvrir</h4>
      <Link to="/cafe">Cafe</Link>
      <Link to="/ceramique">Ateliers</Link>
      <Link to="/boutique">Boutique</Link>
      <Link to="/blog">Blog</Link>
    </div>
    <div>
      <h4>Contact</h4>
      <p>12 rue des Ateliers, Paris 11</p>
      <p>hello@cyramik.studio</p>
      <p>+33 1 42 00 00 00</p>
    </div>
    <div>
      <h4>Horaires</h4>
      <p>Mar - Ven: 9h - 19h</p>
      <p>Sam - Dim: 10h - 20h</p>
      <div className="payments"><FaCcVisa /><FaCcMastercard /><FaCcAmex /></div>
      <small>Mentions legales · CGV · Confidentialite</small>
    </div>
  </footer>
);

export default Footer;
