# Coffee Arts Paris Backend

Node.js, Express, MongoDB and JWT API for the Coffee Arts Paris admin dashboard.

## Setup

```bash
cd back
npm install
cp .env.example .env
```

Edit `.env` if needed:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/coffeeartsparis
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Cloudinary variables are required only when creating products or blogs with uploaded images.

## Seed

Start MongoDB locally, then run:

```bash
npm run seed
```

Admin login:

```text
admin@coffeeartsparis.com
Admin1234!
```

## Dev

```bash
npm run dev
```

The API runs at `http://localhost:5000/api`.

## Frontend Connection

The frontend Axios client is in `front/src/api/axios.js`:

```js
baseURL: 'http://localhost:5000/api'
withCredentials: true
```

`front/src/App.js` wraps the app with `QueryClientProvider`. Dashboard stats are fetched with `useDashboard()` and the 12 `StatCard` values now read from `/api/dashboard/stats`.
