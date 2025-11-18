# MovieHub Frontend

SvelteKit frontend application for MovieHub.

## Features

- 🎬 Movie listings and search
- 📋 Movie details view
- ⭐ Watchlist management
- 🔐 User authentication
- 🎯 Advanced filtering

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables:
```
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts        # Backend API client
│   │   │   └── utils.ts         # Image URL utilities
│   │   ├── components/          # Svelte components
│   │   └── stores.ts            # Svelte stores
│   └── routes/                  # Page routes
├── package.json
└── vite.config.ts
```

## Backend Connection

The frontend connects to the backend API server. Make sure the backend is running on `http://localhost:3001` (or update `VITE_API_URL` in `.env`).

## Build for Production

```bash
npm run build
npm run preview
```

