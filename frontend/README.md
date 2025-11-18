# MovieHub Frontend

SvelteKit frontend application for MovieHub.

## Features

- 🎬 Movie listings and search
- 📋 Movie details view
- ⭐ Watchlist management
- 🔐 User authentication with Svelte stores
- 🎯 Advanced filtering

## State Management with Svelte Stores + Browser Storage

**REQUIRED: Login information and user accounts are stored using Svelte Store + browser storage (localStorage)**:

- **`userStore`** - Stores current logged-in user information (id, email, name)
  - **Uses Svelte Store + browser storage (localStorage)**
  - Automatically loads from localStorage on page load
  - Automatically saves to localStorage whenever value changes
  - Updates on login/signup/logout
  - Used throughout the app for authentication checks
  - Storage key: `'moviehub_user'`

- **`userAccountsStore`** - Stores list of user accounts with login history
  - **Uses Svelte Store + browser storage (localStorage)**
  - Tracks all user accounts that have logged in
  - Stores last login timestamp
  - Automatically loads from localStorage on page load
  - Automatically saves to localStorage whenever accounts change
  - Storage key: `'moviehub_user_accounts'`

- **`watchlistStore`** - Stores user's watchlist (array of movie IDs)
  - Uses Svelte Store + browser storage (localStorage)
  - Syncs with backend API
  - Automatically persists to localStorage

**Implementation Details**:
- All stores use `createPersistentStore()` function which combines Svelte Store with browser localStorage
- Stores use reactive statements (`$store`) for automatic UI updates when values change
- Data persists across browser sessions (survives page refresh)
- All login and account data is stored locally in the browser's localStorage

See [src/lib/STORE_DOCUMENTATION.md](./src/lib/STORE_DOCUMENTATION.md) for detailed documentation.

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
│   │   ├── stores.ts            # Svelte stores (userStore, userAccountsStore, watchlistStore)
│   │   └── STORE_DOCUMENTATION.md  # Detailed store documentation
│   └── routes/                  # Page routes
├── package.json
└── vite.config.ts
```

## Svelte Concepts Used

- **Store**: Multiple writable and derived stores for state management
- **Binding**: Two-way data binding (`bind:value`, `bind:filters`)
- **Async/await**: Used throughout for API calls and data loading
- **Slot**: Used in layout and reusable components

## Backend Connection

The frontend connects to the backend API server. Make sure the backend is running on `http://localhost:3001` (or update `VITE_API_URL` in `.env`).

## Build for Production

```bash
npm run build
npm run preview
```

