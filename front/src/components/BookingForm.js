import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './BookingForm.css';

const BookingForm = ({ workshops = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getMe } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', seats: 1, bookingDate: '', workshop: workshops[0]?._id || '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    setForm((current) => ({
      ...current,
      name: user.name || current.name,
      email: user.email || current.email,
    }));
  }, [user]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();

    if (getMe.isLoading) return;

    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
      return;
    }

    try {
      await api.post('/bookings', form);
      setMessage('Demande envoyee. Nous revenons vers vous rapidement.');
      setForm({ ...form, name: user.name || '', email: user.email || '', phone: '' });
    } catch (error) {
      if (error.response?.status === 401) {
        navigate(`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
        return;
      }

      setMessage('Demo locale: branchez MongoDB pour enregistrer la reservation.');
    }
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <h3>Reserver un atelier</h3>
      {user ? (
        <p className="booking-account">Connecte en tant que <strong>{user.email}</strong></p>
      ) : (
        <p className="booking-account">Connectez-vous pour reserver un atelier.</p>
      )}
      <input name="phone" value={form.phone} onChange={update} placeholder="Telephone" />
      <select name="workshop" value={form.workshop} onChange={update} required>
        <option value="">Choisir un atelier</option>
        {workshops.map((workshop) => <option key={workshop._id} value={workshop._id}>{workshop.title}</option>)}
      </select>
      <input name="bookingDate" value={form.bookingDate} onChange={update} type="datetime-local" required />
      <input name="seats" value={form.seats} onChange={update} type="number" min="1" />
      <button className="btn btn-primary" type="submit" disabled={getMe.isLoading}>
        {user ? 'Envoyer' : 'Se connecter pour reserver'}
      </button>
      {message && <p className="form-note">{message}</p>}
    </form>
  );
};

export default BookingForm;
