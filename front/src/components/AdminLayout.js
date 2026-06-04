import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiBell, FiLogOut, FiMenu, FiRefreshCcw, FiSearch } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('coffeeArtsAdmin');
    navigate('/login');
  };

  return (
    <div className="coffee-admin">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="coffee-admin-shell">
        <header className="coffee-admin-topbar">
          <button className="admin-icon-button mobile-only" type="button" onClick={() => setSidebarOpen(true)} aria-label="Menu">
            <FiMenu />
          </button>
          <label className="admin-search">
            <FiSearch />
            <input placeholder="Rechercher..." />
          </label>
          <div className="admin-top-actions">
            <button className="admin-icon-button" type="button" aria-label="Notifications">
              <FiBell />
              <span />
            </button>
            <div className="admin-profile">
              <span>A</span>
              <div>
                <strong>Admin Coffee Arts Paris</strong>
                <small>coffeeartsparis@gmail.com</small>
              </div>
            </div>
            <button className="admin-reset" type="button">
              <FiRefreshCcw />
              Reinitialiser
            </button>
            <button className="admin-logout" type="button" onClick={logout}>
              <FiLogOut />
            </button>
          </div>
        </header>
        <main className="coffee-admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
