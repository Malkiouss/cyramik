import { useMemo, useState } from 'react';
import { posts, products, workshops } from '../data/siteData';

const adminData = {
  products,
  workshops,
  blog: posts,
  bookings: [
    { _id: 'bk1', name: 'Lea Martin', workshop: 'Initiation modelage', status: 'pending', email: 'lea@mail.com' },
    { _id: 'bk2', name: 'Nora B.', workshop: 'Coffee & clay night', status: 'confirmed', email: 'nora@mail.com' },
  ],
  messages: [
    { _id: 'm1', name: 'Atelier prive', subject: 'Privatisation anniversaire', email: 'hello@mail.com' },
  ],
};

const AdminDashboard = ({ type = 'overview' }) => {
  const [bookingStatus, setBookingStatus] = useState('confirmed');
  const rows = useMemo(() => adminData[type] || [], [type]);
  const titles = {
    overview: 'Vue globale',
    products: 'Produits',
    workshops: 'Ateliers',
    bookings: 'Reservations',
    blog: 'Articles',
    messages: 'Messages',
  };

  if (type === 'overview') {
    return (
      <>
        <h1>Admin dashboard</h1>
        <div className="stats-grid">
          <article><strong>18</strong><span>Produits</span></article>
          <article><strong>7</strong><span>Ateliers actifs</span></article>
          <article><strong>24</strong><span>Bookings</span></article>
          <article><strong>9</strong><span>Messages</span></article>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="admin-header">
        <h1>{titles[type]}</h1>
        {['products', 'workshops', 'blog'].includes(type) && <button className="btn btn-primary">Ajouter</button>}
      </div>

      {['products', 'workshops', 'blog'].includes(type) && (
        <form className="admin-form">
          <input placeholder="Titre / nom" />
          <input placeholder="Prix ou slug" />
          <textarea placeholder="Description" />
          <button className="btn btn-primary" type="button">Enregistrer</button>
        </form>
      )}

      <div className="admin-table">
        {rows.map((row) => (
          <article key={row._id}>
            <div>
              <strong>{row.name || row.title}</strong>
              <span>{row.email || row.category || row.level || row.subject || row.excerpt}</span>
            </div>
            {type === 'bookings' ? (
              <select value={bookingStatus} onChange={(event) => setBookingStatus(event.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            ) : (
              <div className="row-actions">
                {type !== 'messages' && <button>Editer</button>}
                {type !== 'messages' && <button>Supprimer</button>}
                {type === 'messages' && <button>Lire</button>}
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
};

export default AdminDashboard;
