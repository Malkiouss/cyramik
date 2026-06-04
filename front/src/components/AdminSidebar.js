import { NavLink } from 'react-router-dom';
import { FiBookOpen, FiCalendar, FiCoffee, FiEdit3, FiInbox, FiPackage } from 'react-icons/fi';

const links = [
  { to: '/admin/products', label: 'Produits', icon: <FiPackage /> },
  { to: '/admin/workshops', label: 'Ateliers', icon: <FiCoffee /> },
  { to: '/admin/bookings', label: 'Bookings', icon: <FiCalendar /> },
  { to: '/admin/blog', label: 'Blog', icon: <FiEdit3 /> },
  { to: '/admin/messages', label: 'Messages', icon: <FiInbox /> },
  { to: '/admin', label: 'Vue globale', icon: <FiBookOpen /> },
];

const AdminSidebar = () => (
  <aside className="admin-sidebar">
    <strong>Cyramik Admin</strong>
    {links.map((link) => (
      <NavLink key={link.to} to={link.to} end={link.to === '/admin'}>
        {link.icon}
        {link.label}
      </NavLink>
    ))}
  </aside>
);

export default AdminSidebar;
