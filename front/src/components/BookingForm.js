import { useState } from 'react';
import api from '../services/api';
import './BookingForm.css';

const BookingForm = ({ workshops = [] }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', seats: 1, bookingDate: '', workshop: workshops[0]?._id || '' });
  const [message, setMessage] = useState('');

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/bookings', form);
      setMessage('Demande envoyee. Nous revenons vers vous rapidement.');
      setForm({ ...form, name: '', email: '', phone: '' });
    } catch {
      setMessage('Demo locale: branchez MongoDB pour enregistrer la reservation.');
    }
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <h3>Reserver un atelier</h3>
      <input name="name" value={form.name} onChange={update} placeholder="Nom" required />
      <input name="email" value={form.email} onChange={update} placeholder="Email" type="email" required />
      <input name="phone" value={form.phone} onChange={update} placeholder="Telephone" />
      <select name="workshop" value={form.workshop} onChange={update} required>
        <option value="">Choisir un atelier</option>
        {workshops.map((workshop) => <option key={workshop._id} value={workshop._id}>{workshop.title}</option>)}
      </select>
      <input name="bookingDate" value={form.bookingDate} onChange={update} type="datetime-local" required />
      <input name="seats" value={form.seats} onChange={update} type="number" min="1" />
      <button className="btn btn-primary" type="submit">Envoyer</button>
      {message && <p className="form-note">{message}</p>}
    </form>
  );
};

export default BookingForm;
