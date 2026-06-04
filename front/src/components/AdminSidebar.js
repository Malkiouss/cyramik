import { NavLink } from 'react-router-dom';
import {
  FiArrowLeftCircle,
  FiCalendar,
  FiCreditCard,
  FiGift,
  FiGrid,
  FiInbox,
  FiPackage,
  FiPenTool,
  FiShoppingBag,
  FiTruck,
  FiUsers,
} from 'react-icons/fi';
import './AdminSidebar.css';

const links = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid />, end: true },
  { to: '/admin/commandes', label: 'Commandes', icon: <FiShoppingBag /> },
  { to: '/admin/paiements-square', label: 'Paiements Square', icon: <FiCreditCard /> },
  { to: '/admin/ceramique', label: 'Ceramique', icon: <FiPackage /> },
  { to: '/admin/goodies', label: 'Goodies / Lifestyle', icon: <FiGift /> },
  { to: '/admin/ateliers', label: 'Ateliers Standards', icon: <FiCalendar /> },
  { to: '/admin/iftar', label: 'Atelier Iftar Ramadan', icon: <FiCalendar /> },
  { to: '/admin/calendrier', label: 'Calendrier', icon: <FiCalendar /> },
  { to: '/admin/cartes-cadeaux', label: 'Cartes cadeaux', icon: <FiGift /> },
  { to: '/admin/frais-de-livraison', label: 'Frais de livraison', icon: <FiTruck /> },
  { to: '/admin/blogs', label: 'Blogs', icon: <FiPenTool /> },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: <FiUsers /> },
  { to: '/admin/messages', label: 'Messages', icon: <FiInbox /> },
];

const AdminSidebar = ({ open, onClose }) => (
  <aside className={`coffee-admin-sidebar ${open ? 'is-open' : ''}`}>
    <div className="coffee-admin-logo">
      <img src="/logocof.png" alt="Coffee Arts Paris" />
      <strong>Coffee Arts</strong>
      <span>Paris</span>
    </div>

    <nav>
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end} onClick={onClose}>
          {link.icon}
          {link.label}
        </NavLink>
      ))}
      <NavLink to="/" onClick={onClose}>
        <FiArrowLeftCircle />
        Revenir au site
      </NavLink>
    </nav>
  </aside>
);

export default AdminSidebar;
