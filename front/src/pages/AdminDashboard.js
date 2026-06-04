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
import { useDashboard } from '../hooks/useDashboard';
import './AdminDashboard.css';

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
  commandes: { resource: 'orders', title: 'Commandes', fields: ['customer', 'email', 'total', 'status'], filter: 'status', creatable: false },
  'paiements-square': { resource: 'orders', title: 'Paiements Square', fields: ['customer', 'total', 'paymentMethod', 'status'], creatable: false },
  ceramique: { resource: 'products', title: 'Ceramique', fields: ['name', 'price', 'stock', 'isActive'], formFields: ['name', 'description', 'price', 'stock'], category: 'ceramique', photoUpload: true, cardView: true, actionLabel: 'Nouveau produit' },
  goodies: { resource: 'products', title: 'Goodies / Lifestyle', fields: ['name', 'category', 'price', 'stock'], formFields: ['name', 'description', 'category', 'price', 'stock'], category: 'goodies', photoUpload: true, cardView: true, actionLabel: 'Nouveau produit' },
  ateliers: { resource: 'workshops', title: 'Ateliers Standards', fields: ['title', 'date', 'enrolled', 'maxParticipants'], formFields: ['title', 'description', 'date', 'duration', 'maxParticipants', 'price', 'location'], type: 'standard', photoUpload: true, cardView: true, actionLabel: 'Nouvel atelier' },
  iftar: { resource: 'workshops', title: 'Atelier Iftar Ramadan', fields: ['title', 'date', 'enrolled', 'maxParticipants'], formFields: ['title', 'description', 'date', 'duration', 'maxParticipants', 'price', 'location'], type: 'iftar', photoUpload: true, cardView: true, actionLabel: 'Nouvel atelier' },
  calendrier: { resource: 'workshops', title: 'Calendrier', fields: ['title', 'date', 'enrolled', 'maxParticipants'], formFields: ['title', 'description', 'date', 'duration', 'maxParticipants', 'price', 'location'], calendar: true },
  utilisateurs: { resource: 'users', title: 'Utilisateurs', fields: ['name', 'email', 'role', 'isActive'] },
  messages: { resource: 'messages', title: 'Messages', fields: ['fromName', 'fromEmail', 'subject', 'isRead'], creatable: false },
  blogs: { resource: 'blogs', title: 'Blogs', fields: ['title', 'slug', 'published', 'publishedAt'], formFields: ['title', 'excerpt', 'content'], photoUpload: true, cardView: true, actionLabel: 'Nouvel article' },
  'cartes-cadeaux': { resource: 'gift-cards', title: 'Cartes cadeaux', fields: ['code', 'value', 'isActive', 'expiresAt'], formFields: ['value', 'expiresAt'] },
  'frais-de-livraison': { resource: 'shipping', title: 'Frais de livraison', fields: ['name', 'price', 'minOrderAmount'] },
};

const todayForInput = () => new Date().toISOString().slice(0, 10);
const toDateKey = (date) => {
  if (!date) return '';
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return '';
  return value.toISOString().slice(0, 10);
};

const calendarDateTime = (date, duration = 120) => {
  const start = new Date(date);
  if (Number.isNaN(start.getTime())) return '';
  const end = new Date(start.getTime() + Number(duration || 120) * 60 * 1000);
  const format = (value) => value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return `${format(start)}/${format(end)}`;
};

const googleCalendarUrl = (item) => {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: item.title || 'Atelier Coffee Arts Paris',
    dates: calendarDateTime(item.date, item.duration),
    details: item.description || 'Atelier reserve depuis le calendrier Coffee Arts Paris.',
    location: item.location || 'Coffee Arts Paris',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const defaultDraft = (config) => {
  if (config.resource === 'products') return { name: '', description: '', category: config.category || 'goodies', price: '', stock: '' };
  if (config.resource === 'workshops') return { title: '', date: todayForInput(), duration: 120, maxParticipants: 10, price: '', location: 'Coffee Arts Paris' };
  if (config.resource === 'users') return { name: '', email: '', password: 'Admin1234!', role: 'client' };
  if (config.resource === 'blogs') return { title: '', excerpt: '', content: '' };
  if (config.resource === 'gift-cards') return { value: '', expiresAt: '' };
  if (config.resource === 'shipping') return { name: '', price: '', minOrderAmount: 0, estimatedDays: '2-4 jours' };
  return {};
};

const buildPayload = (draft, config) => {
  const { files, id, _id, createdAt, updatedAt, ...payload } = { ...draft };
  if (config.resource === 'products') {
    payload.category = config.category === 'ceramique' ? 'ceramique' : payload.category || config.category || 'goodies';
    payload.price = Number(payload.price);
    payload.stock = Number(payload.stock || 0);
  }
  if (config.resource === 'workshops') {
    payload.type = config.type || payload.type || 'standard';
    payload.duration = Number(payload.duration || 120);
    payload.maxParticipants = Number(payload.maxParticipants || 10);
    payload.price = Number(payload.price);
    payload.enrolled = Number(payload.enrolled || 0);
  }
  if (config.resource === 'gift-cards') payload.value = Number(payload.value);
  if (config.resource === 'shipping') {
    payload.price = Number(payload.price);
    payload.minOrderAmount = Number(payload.minOrderAmount || 0);
  }
  return payload;
};

const buildRequestBody = (payload, draft, config) => {
  if (!config.photoUpload) return payload;
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  Array.from(draft.files || []).forEach((file) => formData.append('images', file));
  return formData;
};

const requestConfig = () => undefined;

const getImage = (item, config) => {
  if (config.resource === 'blogs') return item.coverImage;
  return item.images?.[0];
};

const getChip = (item, config) => item.category || item.type || (item.published ? 'Publie' : 'Brouillon');

const describeItem = (item) => item.description || item.excerpt || item.content?.replace(/<[^>]+>/g, '').slice(0, 130) || 'Aucune description pour le moment.';
const previewImage = (draft, config) => {
  const [file] = Array.from(draft.files || []);
  if (file) return URL.createObjectURL(file);
  return getImage(draft, config);
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
  const { data: stats, isLoading } = useDashboard();

  return (
    <>
      <section className="admin-page-title">
        <h1>Dashboard</h1>
        <p>Vue d'ensemble de votre activite</p>
      </section>
      {isLoading || !stats ? <SkeletonCards /> : (
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

const CalendarBoard = ({ items, onEdit, onDelete }) => {
  const [cursor, setCursor] = useState(() => new Date());
  const monthStart = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const startOffset = (monthStart.getDay() + 6) % 7;
  const firstCell = new Date(monthStart);
  firstCell.setDate(monthStart.getDate() - startOffset);

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstCell);
    date.setDate(firstCell.getDate() + index);
    return date;
  });

  const eventsByDay = useMemo(() => {
    return items.reduce((acc, item) => {
      const key = toDateKey(item.date);
      if (!key) return acc;
      acc[key] = [...(acc[key] || []), item];
      return acc;
    }, {});
  }, [items]);

  const monthEvents = items
    .filter((item) => {
      const date = new Date(item.date);
      return date.getMonth() === cursor.getMonth() && date.getFullYear() === cursor.getFullYear();
    })
    .sort((left, right) => new Date(left.date) - new Date(right.date));

  const moveMonth = (amount) => {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  return (
    <div className="admin-calendar-shell">
      <div className="admin-calendar-hero">
        <div>
          <span>Planning ateliers</span>
          <h2>{cursor.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
          <p>{monthEvents.length} atelier(s) prevu(s) ce mois-ci</p>
        </div>
        <div className="admin-calendar-controls">
          <button type="button" onClick={() => moveMonth(-1)}>Precedent</button>
          <button type="button" onClick={() => setCursor(new Date())}>Aujourd'hui</button>
          <button type="button" onClick={() => moveMonth(1)}>Suivant</button>
        </div>
      </div>

      <div className="admin-calendar-layout">
        <div className="admin-calendar-month" aria-label="Calendrier mensuel">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => <strong key={day}>{day}</strong>)}
          {calendarDays.map((date) => {
            const key = toDateKey(date);
            const dayEvents = eventsByDay[key] || [];
            const isOutside = date.getMonth() !== cursor.getMonth();
            const isToday = key === todayForInput();

            return (
              <div className={`admin-calendar-day ${isOutside ? 'is-outside' : ''} ${isToday ? 'is-today' : ''}`} key={key}>
                <span>{date.getDate()}</span>
                <div>
                  {dayEvents.slice(0, 3).map((item) => (
                    <button type="button" key={item.id} onClick={() => onEdit(item)}>
                      {item.title}
                    </button>
                  ))}
                  {dayEvents.length > 3 && <small>+{dayEvents.length - 3} autre(s)</small>}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="admin-calendar-agenda">
          <h3>A venir</h3>
          {monthEvents.length === 0 ? <p>Aucun atelier planifie pour ce mois.</p> : monthEvents.slice(0, 8).map((item) => (
            <article key={item.id}>
              <time>{new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</time>
              <div>
                <h4>{item.title}</h4>
                <span>{item.enrolled || 0}/{item.maxParticipants || 0} participants · {item.location || 'Coffee Arts Paris'}</span>
                <div className="admin-calendar-actions">
                  <a href={googleCalendarUrl(item)} target="_blank" rel="noreferrer">Google Calendar</a>
                  <button type="button" onClick={() => onEdit(item)}>Modifier</button>
                  <button className="danger" type="button" onClick={() => onDelete(item.id)}>Supprimer</button>
                </div>
              </div>
            </article>
          ))}
        </aside>
      </div>
    </div>
  );
};

export const AdminResourcePage = ({ type }) => {
  const config = resourceConfig[type] || resourceConfig.commandes;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState({});
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const params = {
      category: config.category === 'goodies' ? undefined : config.category,
      type: config.type,
    };
    const { data } = await api.get(`/${config.resource}`, { params });
    const payload = data.data;
    const rows = Array.isArray(payload) ? payload : payload.items || [];
    setItems(rows.map((item) => ({
      ...item,
      customer: item.customer || item.user?.name,
      email: item.email || item.user?.email,
    })));
    setLoading(false);
  }, [config.resource, config.category, config.type]);

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
    setError('');
    try {
      const payload = buildPayload(draft, config);
      const body = buildRequestBody(payload, draft, config);
      if (draft.id) await api.put(`/${config.resource}/${draft.id}`, body, requestConfig(config));
      else await api.post(`/${config.resource}`, body, requestConfig(config));
      setDraft({});
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Enregistrement impossible');
    }
  };

  const patchItem = async (id, patch) => {
    setError('');
    try {
      if ('isRead' in patch) await api.patch(`/${config.resource}/${id}/read`);
      else if ('published' in patch) await api.patch(`/${config.resource}/${id}/publish`);
      else if (config.resource === 'products' && 'isActive' in patch) await api.patch(`/${config.resource}/${id}/toggle`);
      else await api.patch(`/${config.resource}/${id}`, patch);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Mise a jour impossible');
    }
  };

  const remove = async (id) => {
    setError('');
    try {
      await api.delete(`/${config.resource}/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Suppression impossible');
    }
  };

  return (
    <section className="admin-crud-page">
      <div className="admin-page-title admin-crud-title">
        <div>
          <h1>{config.title}</h1>
          <p>Recherche, edition rapide et actions connectees a l'API.</p>
        </div>
        {config.creatable !== false && (
          <button className="admin-primary-action" onClick={() => setDraft(defaultDraft(config))} type="button"><FiPlus /> {config.actionLabel || 'Nouveau'}</button>
        )}
      </div>

      <div className="admin-toolbar">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher..." />
        {type === 'commandes' && <button type="button">Exporter CSV</button>}
      </div>

      {Object.keys(draft).length > 0 && (
        <form className="admin-inline-form" onSubmit={save}>
          {(config.formFields || config.fields.slice(0, 3)).map((field) => (
            field === 'description' || field === 'content' || field === 'excerpt' ? (
              <textarea
                key={field}
                placeholder={field}
                value={draft[field] || ''}
                onChange={(event) => setDraft({ ...draft, [field]: event.target.value })}
                required={field === 'content'}
              />
            ) : field === 'category' ? (
              <select key={field} value={draft[field] || 'goodies'} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })}>
                <option value="goodies">Goodies</option>
                <option value="lifestyle">Lifestyle</option>
              </select>
            ) : (
              <input
                key={field}
                type={field.toLowerCase().includes('date') ? 'date' : ['price', 'stock', 'duration', 'maxParticipants'].includes(field) ? 'number' : 'text'}
                placeholder={field}
                value={draft[field] || ''}
                onChange={(event) => setDraft({ ...draft, [field]: event.target.value })}
                required={['name', 'title', 'price', 'date', 'duration', 'maxParticipants'].includes(field)}
              />
            )
          ))}
          {config.photoUpload && (
            <label className="admin-file-input">
              <span>Ajouter des photos</span>
              <input
                type="file"
                accept="image/*"
                multiple={config.resource !== 'blogs'}
                onChange={(event) => setDraft({ ...draft, files: event.target.files })}
              />
              <small>{draft.files?.length ? `${draft.files.length} photo(s) selectionnee(s)` : 'Cloudinary upload'}</small>
            </label>
          )}
          {config.photoUpload && previewImage(draft, config) && (
            <div className="admin-upload-preview">
              <img src={previewImage(draft, config)} alt="Apercu" />
            </div>
          )}
          <button type="submit">Enregistrer</button>
        </form>
      )}
      {error && <span className="admin-error">{error}</span>}

      {loading ? <div className="admin-list-skeleton" /> : (
        config.calendar ? (
          <CalendarBoard
            items={filtered}
            onEdit={(item) => setDraft({ ...item, date: item.date ? item.date.slice(0, 10) : todayForInput() })}
            onDelete={remove}
          />
        ) : (
        <div className={config.cardView ? 'admin-card-grid' : 'admin-data-table'}>
          {config.cardView && filtered.map((item) => (
            <article className="admin-product-card" key={item.id}>
              <div className="admin-product-image">
                {getImage(item, config) ? <img src={getImage(item, config)} alt={item.name || item.title} /> : <span>Photo</span>}
              </div>
              <div className="admin-product-info">
                <div className="admin-product-title-line">
                  <h2>{item.name || item.title}</h2>
                  {'price' in item && <strong>{money(item.price)}</strong>}
                </div>
                <span className="admin-product-chip">{getChip(item, config)}</span>
                <p>{describeItem(item)}</p>
                {config.resource === 'workshops' && (
                  <small>{item.date ? new Date(item.date).toLocaleDateString('fr-FR') : '-'} · {item.enrolled || 0}/{item.maxParticipants || 0} participants</small>
                )}
              </div>
              <div className="admin-card-actions">
                <button type="button" onClick={() => setDraft({ ...item, date: item.date ? item.date.slice(0, 10) : todayForInput() })}>Modifier</button>
                <button type="button" className="danger" onClick={() => remove(item.id)} aria-label="Supprimer"><FiTrash2 /></button>
              </div>
            </article>
          ))}
          {!config.cardView && (
          <>
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
          </>
          )}
        </div>
        )
      )}
    </section>
  );
};

const AdminDashboard = ({ type }) => {
  if (!type) return <AdminOverview />;
  return <AdminResourcePage type={type} />;
};

export default AdminDashboard;
