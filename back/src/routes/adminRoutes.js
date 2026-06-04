const express = require('express');
const { createItem, deleteItem, getCollection, getStats, updateItem } = require('../data/adminStore');

const router = express.Router();

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email !== 'admin@coffeeartsparis.com' || password !== 'Admin1234!') {
    return res.status(401).json({ message: 'Identifiants invalides' });
  }

  const token = 'coffee-arts-demo-admin-token';
  res.setHeader('Set-Cookie', `coffeeArtsAdmin=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`);
  res.json({
    token,
    user: { name: 'Admin Coffee Arts Paris', email, role: 'admin' },
  });
});

router.post('/auth/logout', (req, res) => {
  res.setHeader('Set-Cookie', 'coffeeArtsAdmin=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
  res.json({ ok: true });
});

router.get('/dashboard/stats', (req, res) => {
  res.json(getStats());
});

router.get('/:resource', (req, res) => {
  const collection = getCollection(req.params.resource);
  if (!collection) return res.status(404).json({ message: 'Ressource introuvable' });
  res.json(collection);
});

router.post('/:resource', (req, res) => {
  const item = createItem(req.params.resource, req.body);
  if (!item) return res.status(404).json({ message: 'Ressource introuvable' });
  res.status(201).json(item);
});

router.patch('/:resource/:id', (req, res) => {
  const item = updateItem(req.params.resource, req.params.id, req.body);
  if (!item) return res.status(404).json({ message: 'Element introuvable' });
  res.json(item);
});

router.delete('/:resource/:id', (req, res) => {
  const deleted = deleteItem(req.params.resource, req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Element introuvable' });
  res.status(204).end();
});

module.exports = router;
