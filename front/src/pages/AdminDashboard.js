import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiBox,
  FiCalendar,
  FiCreditCard,
  FiEdit3,
  FiEye,
  FiEyeOff,
  FiGift,
  FiInbox,
  FiMail,
  FiPlus,
  FiShoppingCart,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi';
import api from '../services/api';

const money = (value) => `${Number(value || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€`;

const statMeta = [
  ['totalRevenue', 'Revenus totaux', "Chiffre d'affaires", 'revenue', FiCreditCard, true],
  ['monthRevenue', 'Revenus du mois', 'Ce mois', 'revenue', FiCreditCard, true],
  ['weekRevenue', 'Revenus de la semaine', 'Cette semaine', 'revenue', FiCreditCard, true],
  ['todayRevenue', 'Revenus du jour', "Aujourd'hui", 'revenue', FiCreditCard, true],
  ['totalOrders', 'Commandes', 'Total des commandes', 'orders', FiShoppingCart],
  ['activeUsers', 'Utilisateurs', 'Comptes actifs', 'users', FiUsers],
  ['totalProducts', 'Produits', 'En catalogue', 'products', FiBox],
  ['totalMessages', 'Messages', 'Total recus', 'messages', FiMail],
  ['unreadMessages', 'Non lus', 'Messages en attente', 'unread', FiInbox],
  ['activeWorkshops', 'Ateliers', 'Ateliers en cours', 'workshops', FiCalendar],
  ['publishedBlogs', 'Blogs', 'Articles publies', 'blogs', FiEdit3],
  ['activeGiftCards', 'Cartes cadeaux', 'Cartes actives', 'gifts', FiGift],
];

const resourceConfig = {
  commandes: { resource: 'orders', title: 'Commandes', fields: ['customer', 'email', 'total', 'status'], filter: 'status' },
  'paiements-square': { resource: 'orders', title: 'Paiements Square', fields: ['customer', 'total', 'paymentMethod', 'status'] },
  ceramique: { resource: 'products', title: 'Ceramique', fields: ['name', 'price', 'stock', 'isActive'], category: 'ceramique' },
  goodies: { resource: 'products', title: 'Goodies / Lifestyle', fields: ['name', 'category', 'price', 'stock'], category: 'goodies' },
  ateliers: { resource: 'workshops', title: 'Ateliers Standards', fields: ['title', 'date', 'enrolled', 'maxParticipants'], type: 'standard' },
  iftar: { resource: 'workshops', title: 'Atelier Iftar Ramadan', fields: ['title', 'date', 'enrolled', 'maxParticipants'], type: 'iftar' },
  calendrier: { resource: 'workshops', title: 'Calendrier', fields: ['title', 'date', 'enrolled', 'maxParticipants'], calendar: true },
  utilisateurs: { resource: 'users', title: 'Utilisateurs', fields: ['name', 'email', 'role', 'isActive'] },
  messages: { resource: 'messages', title: 'Messages', fields: ['fromName', 'fromEmail', 'subject', 'isRead'] },
  blogs: { resource: 'blogs', title: 'Blogs', fields: ['title', 'slug', 'published', 'publishedAt'] },
  'cartes-cadeaux': { resource: 'gift-cards', title: 'Cartes cadeaux', fields: ['code', 'value', 'isActive', 'expiresAt'] },
  'frais-de-livraison': { resource: 'shipping', title: 'Frais de livraison', fields: ['zone', 'price', 'minOrder'] },
};

const SkeletonCards = () => (
  <div className="admin-stats-grid">
    {Array.from({ length: 12 }).map((_, index) => <span className="admin-skeleton-card" key={index} />)}
  </div>
);

const StatCard = ({ meta, value }) => {
  const [visible, setVisible] = useState(true);
  const [, label, subLabel, tone, Icon, isMoney] = meta;
  const display = visible ? (isMoney ? money(value) : value) : '••••';

  return (
    <motion.article className={`admin-stat-card tone-${tone}`} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}>
      <div className="admin-stat-head">
        <Icon />
        <button type="button" onClick={() => setVisible(!visible)} aria-label="Afficher ou masquer">
          {visible ? <FiEye /> : <FiEyeOff />}
        </button>
      </div>
      <strong>{display}</strong>
      <span>{label}</span>
      <small>{subLabel}</small>
    </motion.article>
  );
};

export const AdminOverview = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard/stats').then(({ data }) => setStats(data));
  }, []);

  return (
    <>
      <section className="admin-page-title">
        <h1>Dashboard</h1>
        <p>Vue d'ensemble de votre activite</p>
      </section>
      {!stats ? <SkeletonCards /> : (
        <div className="admin-stats-grid">
          {statMeta.map((meta) => <StatCard key={meta[0]} meta={meta} value={stats[meta[0]]} />)}
        </div>
      )}
    </>
  );
};

const formatCell = (field, value) => {
  if (typeof value === 'boolean') return value ? 'Actif' : 'Inactif';
  if (field.toLowerCase().includes('date') || field === 'expiresAt' || field === 'publishedAt') return value ? new Date(value).toLocaleDateString('fr-FR') : '-';
  if (field === 'price' || field === 'total' || field === 'value') return money(value);
  return value ?? '-';
};

export const AdminResourcePage = ({ type }) => {
  const config = resourceConfig[type] || resourceConfig.commandes;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await api.get(`/admin/${config.resource}`);
    setItems(data);
    setLoading(false);
  }, [config.resource]);

  useEffect(() => {
    load();
  }, [type, load]);

  const filtered = useMemo(() => {
    return items
      .filter((item) => !config.category || item.category === config.category || (config.category === 'goodies' && ['goodies', 'lifestyle'].includes(item.category)))
      .filter((item) => !config.type || item.type === config.type)
      .filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase()));
  }, [items, query, config]);

  const save = async (event) => {
    event.preventDefault();
    const payload = { ...draft, category: config.category === 'ceramique' ? 'ceramique' : draft.category || config.category, type: config.type || draft.type };
    await api.post(`/admin/${config.resource}`, payload);
    setDraft({});
    load();
  };

  const patchItem = async (id, patch) => {
    await api.patch(`/admin/${config.resource}/${id}`, patch);
    load();
  };

  const remove = async (id) => {
    await api.delete(`/admin/${config.resource}/${id}`);
    load();
  };

  return (
    <section className="admin-crud-page">
      <div className="admin-page-title admin-crud-title">
        <div>
          <h1>{config.title}</h1>
          <p>Recherche, edition rapide et actions connectees a l'API.</p>
        </div>
        <button className="admin-primary-action" onClick={() => setDraft({ name: '', title: '' })} type="button"><FiPlus /> Nouveau</button>
      </div>

      <div className="admin-toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher..." />
        {type === 'commandes' && <button type="button">Exporter CSV</button>}
      </div>

      {Object.keys(draft).length > 0 && (
        <form className="admin-inline-form" onSubmit={save}>
          {config.fields.slice(0, 3).map((field) => (
            <input key={field} placeholder={field} value={draft[field] || ''} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })} />
          ))}
          <button type="submit">Enregistrer</button>
        </form>
      )}

      {loading ? <div className="admin-list-skeleton" /> : (
        <div className={config.calendar ? 'admin-calendar-grid' : 'admin-data-table'}>
          {!config.calendar && (
            <div className="admin-table-row admin-table-head">
              {config.fields.map((field) => <span key={field}>{field}</span>)}
              <span>Actions</span>
            </div>
          )}
          {filtered.map((item) => (
            <article className="admin-table-row" key={item.id}>
              {config.fields.map((field) => <span key={field}>{formatCell(field, item[field])}</span>)}
              <span className="admin-row-actions">
                {'isRead' in item && <button onClick={() => patchItem(item.id, { isRead: !item.isRead })} type="button">Lire</button>}
                {'isActive' in item && <button onClick={() => patchItem(item.id, { isActive: !item.isActive })} type="button">{item.isActive ? 'Desactiver' : 'Activer'}</button>}
                {'published' in item && <button onClick={() => patchItem(item.id, { published: !item.published })} type="button">Publier</button>}
                <button onClick={() => remove(item.id)} type="button" aria-label="Supprimer"><FiTrash2 /></button>
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

const AdminDashboard = ({ type }) => {
  if (!type) return <AdminOverview />;
  return <AdminResourcePage type={type} />;
};

export default AdminDashboard;
