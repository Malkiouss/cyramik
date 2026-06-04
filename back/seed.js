require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./src/config/db');
const User = require('./src/models/User.model');
const Order = require('./src/models/Order.model');
const Product = require('./src/models/Product.model');
const Workshop = require('./src/models/Workshop.model');
const Message = require('./src/models/Message.model');
const Blog = require('./src/models/Blog.model');
const GiftCard = require('./src/models/GiftCard.model');
const ShippingZone = require('./src/models/ShippingZone.model');
const generateSlug = require('./src/utils/generateSlug');

const firstNames = ['Camille', 'Lea', 'Manon', 'Chloe', 'Ines', 'Sarah', 'Emma', 'Jade', 'Louise', 'Alice', 'Clara', 'Juliette', 'Nina', 'Anna', 'Marie', 'Sofia', 'Lucie', 'Eva', 'Lina', 'Nour', 'Hugo', 'Lucas', 'Leo', 'Gabriel', 'Louis', 'Jules', 'Adam', 'Raphael', 'Arthur', 'Noah'];
const lastNames = ['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Dubois', 'Moreau', 'Laurent', 'Simon', 'Michel', 'Lefebvre', 'Leroy', 'Roux', 'David', 'Bertrand', 'Morel', 'Fournier', 'Girard'];
const orderTotals = [520, 780, 640, 910, 430, 1200, 360, 845, 690, 550, 745, 980, 310, 1240, 875, 455, 610, 735, 995, 680, 420, 1125, 560, 790, 650, 470, 835, 905, 715, 585, 1010, 375, 660, 525, 940, 805, 490, 1150, 625, 700, 530, 760, 890, 450, 1080, 615, 570, 830, 695, 1175];

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Order.deleteMany({}),
    Product.deleteMany({}),
    Workshop.deleteMany({}),
    Message.deleteMany({}),
    Blog.deleteMany({}),
    GiftCard.deleteMany({}),
    ShippingZone.deleteMany({}),
  ]);

  const password = await bcrypt.hash('Admin1234!', 12);
  const admin = await User.create({
    name: 'Admin Coffee Arts Paris',
    email: 'admin@coffeeartsparis.com',
    password,
    role: 'admin',
    isActive: true,
  });

  const users = [];
  for (let i = 0; i < 140; i += 1) {
    users.push({
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      email: `client${String(i + 1).padStart(3, '0')}@coffeeartsparis.com`,
      password: await bcrypt.hash(`Client${i + 1}!2026`, 10),
      role: i % 18 === 0 ? 'staff' : 'client',
      isActive: i % 11 !== 0,
      avatar: `https://i.pravatar.cc/160?img=${(i % 70) + 1}`,
      createdAt: daysAgo(i),
    });
  }
  const createdUsers = await User.insertMany(users);

  const products = await Product.insertMany([
    ['Tasse emaillee Aube', 'Tasse faconnee a la main, email rose poudre.', 42, 18, 'ceramique'],
    ['Bol atelier Sienne', 'Bol en gres chamotte, piece unique.', 55, 12, 'ceramique'],
    ['Assiette Riviera', 'Assiette plate aux lignes organiques.', 68, 9, 'ceramique'],
    ['Vase Montmartre', 'Vase sculptural en ceramique emaillee.', 120, 5, 'ceramique'],
    ['Set espresso Marais', 'Duo de tasses espresso artisanales.', 74, 14, 'ceramique'],
    ['Pichet Celadon', 'Pichet verseur email celadon.', 96, 7, 'ceramique'],
    ['Tote bag Coffee Arts', 'Sac coton epais imprime.', 24, 60, 'goodies'],
    ['Carnet de croquis', 'Carnet pour idees, recettes et croquis.', 18, 45, 'goodies'],
    ['Bougie atelier', 'Bougie parfumee cafe blanc et argile.', 32, 30, 'goodies'],
  ].map(([name, description, price, stock, category], index) => ({
    name,
    description,
    price,
    stock,
    category,
    images: [`https://placehold.co/900x700/efe7dc/2f251f?text=${encodeURIComponent(name)}`],
    isActive: true,
    createdAt: daysAgo(index * 3),
  })));

  await Order.insertMany(orderTotals.map((total, index) => {
    const product = products[index % products.length];
    return {
      user: createdUsers[index % createdUsers.length]._id,
      items: [{ product: product._id, quantity: 1 + (index % 3), price: product.price }],
      total,
      status: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'][index % 5],
      paymentMethod: ['card', 'paypal', 'cash', 'gift-card'][index % 4],
      paymentStatus: 'paid',
      shippingAddress: {
        street: `${10 + index} rue des Ateliers`,
        city: index % 4 === 0 ? 'Paris' : 'Lyon',
        postalCode: index % 4 === 0 ? '75011' : '69002',
        country: 'France',
      },
      createdAt: daysAgo(Math.floor((index / 49) * 180)),
    };
  }));

  await Workshop.insertMany([
    ...Array.from({ length: 10 }).map((_, index) => ({
      title: `Atelier ceramique debutant ${index + 1}`,
      slug: generateSlug(`Atelier ceramique debutant ${index + 1}`),
      type: 'standard',
      description: 'Initiation au modelage et a l email.',
      date: index < 4 ? daysAgo((index + 1) * 12) : daysFromNow((index - 3) * 8),
      duration: 150,
      maxParticipants: 12,
      enrolled: 4 + (index % 7),
      price: 69,
      location: 'Coffee Arts Paris, 11e',
      images: [`https://placehold.co/1000x700/ded7c8/2f251f?text=${encodeURIComponent(`Atelier ceramique ${index + 1}`)}`],
      isActive: true,
    })),
    ...Array.from({ length: 2 }).map((_, index) => ({
      title: `Atelier special artiste invite ${index + 1}`,
      slug: generateSlug(`Atelier special artiste invite ${index + 1}`),
      type: 'special',
      description: 'Session creative avec un ceramiste invite.',
      date: daysFromNow(35 + index * 10),
      duration: 180,
      maxParticipants: 10,
      enrolled: 5 + index,
      price: 95,
      location: 'Coffee Arts Paris, 11e',
      images: [`https://placehold.co/1000x700/cfc7b7/2f251f?text=${encodeURIComponent(`Atelier special ${index + 1}`)}`],
      isActive: true,
    })),
    ...Array.from({ length: 2 }).map((_, index) => ({
      title: `Atelier Iftar Ramadan ${index + 1}`,
      slug: generateSlug(`Atelier Iftar Ramadan ${index + 1}`),
      type: 'iftar',
      description: 'Modelage, cafe de specialite et table iftar.',
      date: index === 0 ? daysAgo(30) : daysFromNow(60),
      duration: 210,
      maxParticipants: 16,
      enrolled: 10 + index,
      price: 110,
      location: 'Coffee Arts Paris, 11e',
      images: [`https://placehold.co/1000x700/bfada0/2f251f?text=${encodeURIComponent(`Atelier Iftar ${index + 1}`)}`],
      isActive: true,
    })),
  ]);

  await Message.insertMany(Array.from({ length: 12 }).map((_, index) => ({
    fromName: `${firstNames[index]} ${lastNames[index]}`,
    fromEmail: `message${index + 1}@example.fr`,
    subject: index % 3 === 0 ? 'Demande de privatisation' : 'Question atelier',
    content: 'Bonjour, je souhaite avoir plus d informations sur vos ateliers et disponibilites.',
    isRead: index === 11,
    createdAt: daysAgo(index),
  })));

  await Blog.insertMany(Array.from({ length: 7 }).map((_, index) => {
    const title = [
      'Choisir sa premiere piece en ceramique',
      'Dans les coulisses de notre atelier parisien',
      'Cafe de specialite et gestes artisanaux',
      'Guide des emaux pour debutants',
      'Idees cadeaux pour amateurs de cafe',
      'Organiser un atelier prive a Paris',
      'Rencontre avec nos ceramistes',
    ][index];
    return {
      title,
      slug: generateSlug(title),
      content: `<p>${title}. Un article complet pour inspirer la communaute Coffee Arts Paris.</p>`,
      excerpt: 'Conseils, inspirations et vie d atelier.',
      coverImage: `https://placehold.co/1200x800/d9cbbb/2f251f?text=${encodeURIComponent(title)}`,
      published: true,
      publishedAt: daysAgo(index * 6),
      author: admin._id,
      createdAt: daysAgo(index * 6),
    };
  }));

  await GiftCard.insertMany([
    { code: 'CAP-PAR-050', value: 50, isActive: true, expiresAt: daysFromNow(365), createdAt: daysAgo(8) },
    { code: 'CAP-PAR-100', value: 100, isActive: true, expiresAt: daysFromNow(365), createdAt: daysAgo(6) },
    { code: 'CAP-PAR-150', value: 150, isActive: true, expiresAt: daysFromNow(365), createdAt: daysAgo(4) },
  ]);

  await ShippingZone.insertMany([
    { name: 'Paris', regions: ['Paris', '75'], price: 4.9, minOrderAmount: 80, estimatedDays: '1-2 jours', isActive: true },
    { name: 'France', regions: ['France metropolitaine'], price: 8.9, minOrderAmount: 120, estimatedDays: '2-4 jours', isActive: true },
    { name: 'International', regions: ['Union europeenne', 'Suisse', 'Royaume-Uni'], price: 18.9, minOrderAmount: 180, estimatedDays: '5-10 jours', isActive: true },
  ]);

  console.log('Seed complete: admin + 140 users, 50 orders, products, workshops, messages, blogs, gift cards, shipping zones.');
  console.log('Admin login: admin@coffeeartsparis.com / Admin1234!');
  await mongoose.disconnect();
};

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
