import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';
import { navLeft, navRight } from '../data/siteData';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [...navLeft, ...navRight];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <nav className="nav-shell">
        <div className="nav-group nav-group--left">
          {navLeft.map((item) => (
            <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
          ))}
        </div>

        <Link to="/" className="brand" aria-label="Cyramik home">
          <img
            src={scrolled ? '/coffee-arts-scrolled-logo.png' : '/logocof.png'}
            alt="Coffee Arts Paris"
          />
        </Link>

        <div className="nav-group nav-group--right">
          {navRight.map((item) => (
            <NavLink key={item.path} to={item.path}>{item.label}</NavLink>
          ))}
          <Link className="icon-link" to="/boutique" aria-label="Panier"><FiShoppingBag /></Link>
          <Link className="icon-link" to="/client" aria-label="Compte"><FiUser /></Link>
        </div>

        <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-label="Menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {open && (
        <div className="mobile-menu">
          {links.map((item) => (
            <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)}>{item.label}</NavLink>
          ))}
          <NavLink to="/admin" onClick={() => setOpen(false)}>Admin dashboard</NavLink>
        </div>
      )}
    </header>
  );
};

export default Navbar;
