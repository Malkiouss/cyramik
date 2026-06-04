import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiCoffee, FiLogOut, FiSettings, FiShoppingBag, FiUser } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import './ClientSpace.css';

const ClientSpace = () => {
  const navigate = useNavigate();
  const { user, getMe, logout } = useAuth();
  const initials = (user?.name || user?.email || 'CA')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const signOut = async () => {
    await logout.mutateAsync();
    navigate('/login');
  };

  if (getMe.isLoading) {
    return (
      <main className="client-profile-page page-offset">
        <section className="client-profile-shell client-profile-shell--loading" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="client-profile-page page-offset">
        <section className="client-profile-empty">
          <span className="eyebrow">Espace client</span>
          <h1>Connectez-vous a votre espace</h1>
          <p>Retrouvez votre profil Coffee Arts Paris, vos reservations et vos commandes depuis un seul endroit.</p>
          <Link className="btn btn-primary" to="/login">Se connecter</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="client-profile-page page-offset">
      <section className="client-profile-shell">
        <div className="client-profile-hero">
          <div className="client-avatar">
            {user.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{initials}</span>}
          </div>
          <span className="eyebrow">Mon profil</span>
          <h1>Bonjour, {user.name}</h1>
          <p>Votre espace personnel Coffee Arts Paris est pret pour suivre vos envies cafe, ceramique et boutique.</p>
        </div>

        <div className="client-profile-grid">
          <article className="client-profile-card client-profile-card--main">
            <div>
              <FiUser />
              <span>Compte</span>
            </div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <small>{user.role === 'admin' ? 'Administrateur' : 'Client'}</small>
          </article>

          <article className="client-profile-card">
            <FiCalendar />
            <h3>Reservations</h3>
            <p>Vos prochains ateliers apparaitront ici.</p>
          </article>

          <article className="client-profile-card">
            <FiShoppingBag />
            <h3>Commandes</h3>
            <p>Suivez bientot vos achats boutique et cartes cadeaux.</p>
          </article>

          <article className="client-profile-card">
            <FiCoffee />
            <h3>Preferences</h3>
            <p>Gardez vos experiences favorites a portee de main.</p>
          </article>
        </div>

        <div className="client-profile-actions">
          {user.role === 'admin' && (
            <Link className="btn btn-dark" to="/admin">
              <FiSettings />
              Dashboard admin
            </Link>
          )}
          <button className="btn btn-primary" type="button" onClick={signOut} disabled={logout.isPending}>
            <FiLogOut />
            {logout.isPending ? 'Deconnexion...' : 'Se deconnecter'}
          </button>
        </div>
      </section>
    </main>
  );
};

export default ClientSpace;
