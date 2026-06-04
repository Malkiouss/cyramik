import boutique from '../assets/images/boutique.svg';
import ceramic from '../assets/images/ceramic.svg';
import coffee from '../assets/images/coffee.svg';
import event from '../assets/images/event.svg';
import studioTable from '../assets/images/studio-table.svg';

export const navLeft = [
  { label: 'Cafe', path: '/cafe' },
  { label: 'Ceramique', path: '/ceramique' },
  { label: 'Boutique', path: '/boutique' },
  { label: 'Evenements', path: '/evenements' },
];

export const navRight = [
  { label: 'Blog', path: '/blog' },
  { label: 'Nos engagements', path: '/engagements' },
  { label: 'Contact', path: '/contact' },
  { label: 'Espace client', path: '/client' },
];

export const experiences = [
  {
    label: 'DEGUSTER',
    title: 'Cafe de specialite',
    text: 'Des extractions soignees, des boissons douces et des patisseries maison.',
    image: coffee,
    path: '/cafe',
  },
  {
    label: 'CREER',
    title: 'Ateliers creatifs',
    text: 'Modelage, peinture sur ceramique et moments lents autour de la matiere.',
    image: ceramic,
    path: '/ceramique',
  },
  {
    label: 'EMPORTER',
    title: 'Boutique',
    text: 'Pieces artisanales, coffrets cafe et objets sensibles pour la maison.',
    image: boutique,
    path: '/boutique',
  },
];

export const galleryImages = [coffee, ceramic, boutique, studioTable, event, coffee, ceramic];

export const socialCards = [
  'Latte velours et tasse emaillee a la main',
  'Premiere cuisson pour les bols du samedi',
  'Carnet de croquis, cafe filtre, argile blanche',
  'Table commune avant un atelier peinture',
  'Nouvelle collection de mugs sauge',
  'Soiree privee autour du tour de potier',
];

export const instagramPosts = [
  { image: coffee, alt: 'Latte art verse dans une tasse en ceramique' },
  { image: studioTable, alt: 'Table d atelier preparee avec verres et feuillage' },
  { image: boutique, alt: 'Selection de pieces artisanales Coffee Arts Paris' },
  { image: ceramic, alt: 'Details de ceramiques emaillees' },
  { image: event, alt: 'Moment creatif autour du cafe et de la ceramique' },
  { image: coffee, alt: 'Cafe de specialite et instant doux au studio' },
];

export const products = [
  { _id: 'p1', name: 'Mug sauge emaille', price: 34, category: 'Ceramique', imageUrl: boutique, stock: 12 },
  { _id: 'p2', name: 'Coffret espresso & tasse', price: 42, category: 'Cafe', imageUrl: coffee, stock: 8 },
  { _id: 'p3', name: 'Assiette nuage', price: 29, category: 'Art de table', imageUrl: ceramic, stock: 15 },
];

export const workshops = [
  {
    _id: 'w1',
    title: 'Initiation modelage',
    duration: '2h',
    level: 'Debutant',
    price: 55,
    imageUrl: ceramic,
    description: 'Decouvrez les gestes essentiels pour faconner une piece unique.',
  },
  {
    _id: 'w2',
    title: 'Peinture sur ceramique',
    duration: '1h30',
    level: 'Tous niveaux',
    price: 38,
    imageUrl: studioTable,
    description: 'Choisissez une piece, composez vos couleurs, repartez avec une creation cuite.',
  },
  {
    _id: 'w3',
    title: 'Coffee & clay night',
    duration: '2h30',
    level: 'Tous niveaux',
    price: 68,
    imageUrl: event,
    description: 'Une soiree douce entre degustation, modelage et table partagee.',
  },
];

export const posts = [
  {
    _id: 'b1',
    slug: 'choisir-son-email',
    title: 'Choisir son email comme une couleur de saison',
    excerpt: 'Nos conseils pour accorder texture, usage et humeur dans vos pieces.',
    imageUrl: ceramic,
  },
  {
    _id: 'b2',
    slug: 'rituel-filtre',
    title: 'Le cafe filtre, rituel lent du matin',
    excerpt: 'Une methode simple pour mieux sentir les notes florales et chocolatees.',
    imageUrl: coffee,
  },
];

export const events = [
  { _id: 'e1', title: 'Brunch ceramique', date: '2026-06-14', description: 'Brunch maison, playlist douce et peinture sur bol.', imageUrl: event },
  { _id: 'e2', title: 'Marche des pieces imparfaites', date: '2026-06-28', description: 'Series limitees, prototypes et cafe glace.', imageUrl: boutique },
];
