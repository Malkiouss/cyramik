# Vercel deployment

This project is deployed as two separate Vercel projects:

- `front`: React frontend
- `back`: Express API backend

## 1. Backend project

In Vercel, import the repo and set the project root directory to `back`.

Use these settings:

- Framework Preset: `Other`
- Build Command: leave empty
- Output Directory: leave empty
- Install Command: `npm install`

Add these environment variables in Vercel:

```env
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/coffeeartsparis
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

After deploy, test:

```txt
https://your-backend.vercel.app/api/health
```

Expected response:

```json
{ "success": true, "data": { "status": "ok" } }
```

## 2. Frontend project

In Vercel, import the repo and set the project root directory to `front`.

Use these settings:

- Framework Preset: `Create React App`
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

Add this environment variable in Vercel:

```env
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

Redeploy the frontend after adding or changing `REACT_APP_API_URL`.

## 3. Link frontend and backend

The two variables must point to each other:

- Backend `CLIENT_URL` must be the frontend URL, for example `https://coffee-arts-front.vercel.app`
- Frontend `REACT_APP_API_URL` must be the backend API URL, for example `https://coffee-arts-back.vercel.app/api`

If you also use a custom domain, add it to backend `CLIENT_URL`. Multiple frontend origins can be comma-separated:

```env
CLIENT_URL=https://coffee-arts-front.vercel.app,https://www.your-domain.com
```

## 4. Common checks

- If browser requests fail with CORS errors, check backend `CLIENT_URL`.
- If the frontend still calls localhost, check frontend `REACT_APP_API_URL` and redeploy.
- If backend returns Mongo errors, check `MONGO_URI` and MongoDB Atlas network access.
- If uploads fail, check Cloudinary variables.
