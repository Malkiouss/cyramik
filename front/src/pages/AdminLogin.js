import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'admin@coffeeartsparis.com', password: 'Admin1234!' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login.mutateAsync(form);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Connexion impossible');
    }
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <h1>Coffee Arts Paris</h1>

        <div className="login-tabs" aria-label="Authentification">
          <button className="login-tab login-tab--active" type="button">Connexion</button>
          <button className="login-tab" type="button">Inscription</button>
        </div>

        <label className="login-field">
          <span>Email</span>
          <input
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="Email"
            type="email"
            required
          />
        </label>

        <label className="login-field login-password-field">
          <span>Mot de passe</span>
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Mot de passe"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </label>

        {error && <span className="admin-error">{error}</span>}
        <button className="login-submit" type="submit">Se connecter</button>

        <div className="login-separator"><span>OU</span></div>

        <button className="google-login-button" type="button">
          <span aria-hidden="true">G</span>
          Continuer avec Google
        </button>

        <p className="login-signup">Pas encore de compte ? <button type="button">S'inscrire</button></p>
      </form>
      <Link className="login-back-link" to="/">
        <FiArrowLeft />
        Retour à l'accueil
      </Link>
    </main>
  );
};

export default AdminLogin;
