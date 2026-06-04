const now = new Date();

const daysAgo = (days) => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

let store = {
  orders: [
    { id: 'ord-001', customer: 'Lea Martin', email: 'lea@example.com', total: 280, status: 'confirmed', paymentMethod: 'Square', createdAt: daysAgo(2) },
    { id: 'ord-002', customer: 'Nora Benali', email: 'nora@example.com', total: 145, status: 'pending', paymentMethod: 'Carte', createdAt: daysAgo(5) },
    { id: 'ord-003', customer: 'Camille Durand', email: 'camille@example.com', total: 625, status: 'done', paymentMethod: 'Square', createdAt: daysAgo(21) },
  ],
  products: [
    { id: 'prd-001', name: 'Bol espresso emaille sauge', category: 'ceramique', price: 38, stock: 14, isActive: true, imageUrl: '' },
    { id: 'prd-002', name: 'Tasse atelier signature', category: 'ceramique', price: 44, stock: 9, isActive: true, imageUrl: '' },
    { id: 'prd-003', name: 'Vase rive gauche', category: 'ceramique', price: 96, stock: 5, isActive: true, imageUrl: '' },
    { id: 'prd-004', name: 'Assiette brunch', category: 'ceramique', price: 52, stock: 18, isActive: true, imageUrl: '' },
    { id: 'prd-005', name: 'Pichet cafe creme', category: 'ceramique', price: 86, stock: 7, isActive: true, imageUrl: '' },
    { id: 'prd-006', name: 'Set coupelles aperitif', category: 'ceramique', price: 64, stock: 11, isActive: true, imageUrl: '' },
    { id: 'prd-007', name: 'Tote bag Coffee Arts', category: 'goodies', price: 22, stock: 34, isActive: true, imageUrl: '' },
    { id: 'prd-008', name: 'Carnet croquis argile', category: 'lifestyle', price: 18, stock: 26, isActive: true, imageUrl: '' },
    { id: 'prd-009', name: 'Bougie atelier', category: 'lifestyle', price: 29, stock: 16, isActive: true, imageUrl: '' },
  ],
  workshops: Array.from({ length: 14 }, (_, index) => ({
    id: `wrk-${String(index + 1).padStart(3, '0')}`,
    title: index % 4 === 0 ? 'Atelier Iftar Ramadan' : `Atelier modelage ${index + 1}`,
    type: index % 4 === 0 ? 'iftar' : 'standard',
    date: daysAgo(-index - 3),
    maxParticipants: 12,
    enrolled: Math.min(12, 4 + (index % 9)),
    isActive: true,
  })),
  users: Array.from({ length: 140 }, (_, index) => ({
    id: `usr-${String(index + 1).padStart(3, '0')}`,
    name: `Client Coffee Arts ${index + 1}`,
    email: `client${index + 1}@example.com`,
    role: index === 0 ? 'admin' : 'client',
    isActive: true,
    createdAt: daysAgo(index % 80),
  })),
  messages: Array.from({ length: 12 }, (_, index) => ({
    id: `msg-${String(index + 1).padStart(3, '0')}`,
    fromName: ['Sarah', 'Thomas', 'Ines', 'Julien'][index % 4],
    fromEmail: `contact${index + 1}@example.com`,
    subject: index % 3 === 0 ? 'Privatisation atelier' : 'Question reservation',
    content: 'Bonjour, je souhaite organiser une session autour du cafe et de la ceramique.',
    isRead: index === 11,
    createdAt: daysAgo(index),
  })),
  blogs: Array.from({ length: 7 }, (_, index) => ({
    id: `blg-${String(index + 1).padStart(3, '0')}`,
    title: `Carnet d'atelier ${index + 1}`,
    slug: `carnet-atelier-${index + 1}`,
    content: 'Recit de saison autour des gestes, des matieres et du cafe.',
    published: true,
    publishedAt: daysAgo(index * 7),
  })),
  giftCards: [
    { id: 'gft-001', code: 'PARIS-120', value: 120, isActive: true, expiresAt: daysAgo(-120), usedBy: '' },
    { id: 'gft-002', code: 'ATELIER-80', value: 80, isActive: true, expiresAt: daysAgo(-90), usedBy: '' },
    { id: 'gft-003', code: 'CAFE-50', value: 50, isActive: true, expiresAt: daysAgo(-60), usedBy: '' },
  ],
  shipping: [
    { id: 'shp-001', zone: 'Paris intramuros', price: 6.9, minOrder: 45 },
    { id: 'shp-002', zone: 'Petite couronne', price: 9.9, minOrder: 70 },
    { id: 'shp-003', zone: 'France metropolitaine', price: 12.9, minOrder: 90 },
  ],
};

const revenue = {
  totalRevenue: 36480,
  monthRevenue: 1050,
  weekRevenue: 1505,
  todayRevenue: 0,
};

const resourceMap = {
  orders: 'orders',
  products: 'products',
  workshops: 'workshops',
  users: 'users',
  messages: 'messages',
  blogs: 'blogs',
  'gift-cards': 'giftCards',
  shipping: 'shipping',
};

const getStats = () => ({
  ...revenue,
  totalOrders: 0,
  activeUsers: store.users.filter((user) => user.isActive).length,
  totalProducts: store.products.filter((product) => product.category === 'ceramique').length,
  totalMessages: store.messages.length,
  unreadMessages: store.messages.filter((message) => !message.isRead).length,
  activeWorkshops: store.workshops.filter((workshop) => workshop.isActive).length,
  publishedBlogs: store.blogs.filter((blog) => blog.published).length,
  activeGiftCards: store.giftCards.filter((card) => card.isActive).length,
});

const getCollection = (resource) => {
  const key = resourceMap[resource];
  return key ? store[key] : null;
};

const createItem = (resource, payload) => {
  const collection = getCollection(resource);
  if (!collection) return null;
  const item = { id: `${resource.slice(0, 3)}-${Date.now()}`, ...payload };
  collection.unshift(item);
  return item;
};

const updateItem = (resource, id, payload) => {
  const collection = getCollection(resource);
  if (!collection) return null;
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return null;
  collection[index] = { ...collection[index], ...payload };
  return collection[index];
};

const deleteItem = (resource, id) => {
  const collection = getCollection(resource);
  if (!collection) return false;
  const before = collection.length;
  store[resourceMap[resource]] = collection.filter((item) => item.id !== id);
  return before !== store[resourceMap[resource]].length;
};

module.exports = { getStats, getCollection, createItem, updateItem, deleteItem };
