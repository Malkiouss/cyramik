import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'admin@coffeeartsparis.com', password: 'Admin1234!' });
  const [error, setError] = useState('');

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
        <img src="/logocof.png" alt="Coffee Arts Paris" />
        <h1>Coffee Arts Paris</h1>
        <p>Acces administrateur</p>
        <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        {error && <span className="admin-error">{error}</span>}
        <button className="btn btn-primary" type="submit">Connexion</button>
      </form>
    </main>
  );
};

export default AdminLogin;
