const app = require('../src/app');
const connectDB = require('../src/config/db');

let dbPromise;

module.exports = async (req, res) => {
  const path = (req.url || '').split('?')[0];
  const canSkipDatabase = req.method === 'OPTIONS' || path === '/' || path === '/api/health';

  if (!canSkipDatabase) {
    try {
      dbPromise = dbPromise || connectDB();
      await dbPromise;
    } catch (error) {
      dbPromise = undefined;
      console.error('Database connection failed:', error.message);
      return res.status(503).json({
        success: false,
        message: 'Database connection failed. Check MONGO_URI/MONGODB_URI and MongoDB Atlas network access.',
        data: null,
      });
    }
  }

  return app(req, res);
};
