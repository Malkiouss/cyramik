import { useState } from 'react';
import api from '../services/api';
import './ContactForm.css';

const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/contact', form);
      setStatus('Message envoye, merci.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('Demo locale: votre formulaire est pret, l API attend MongoDB.');
    }
  };

  return (
    <form className="form-card" onSubmit={submit}>
      <h3>Nous ecrire</h3>
      <input name="name" value={form.name} onChange={update} placeholder="Nom" required />
      <input name="email" value={form.email} onChange={update} placeholder="Email" type="email" required />
      <input name="subject" value={form.subject} onChange={update} placeholder="Sujet" />
      <textarea name="message" value={form.message} onChange={update} placeholder="Votre message" rows="5" required />
      <button className="btn btn-primary" type="submit">Envoyer</button>
      {status && <p className="form-note">{status}</p>}
    </form>
  );
};

export default ContactForm;
