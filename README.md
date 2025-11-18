# MovieHub - SvelteKit Movie Listing Application

A SvelteKit movie listing web application built according to the assessment requirements.

## Project Structure

```
SvelteKit/
├── frontend/         # SvelteKit frontend application
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## Architecture

- **Frontend**: SvelteKit application (TypeScript)
- **Authentication**: Client-side using Svelte stores with localStorage
- **Data Storage**: Browser localStorage via Svelte stores
- **Movie Data**: Direct API calls to TMDb API

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TMDb API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `frontend` directory:
```bash
cd frontend
echo "VITE_TMDB_API_KEY=your_api_key_here" > .env
```

   **Important**: Replace `your_api_key_here` with your actual TMDb API key.
   
   To get a free TMDb API key:
   1. Go to https://www.themoviedb.org/settings/api
   2. Sign up or log in
   3. Request an API key
   4. Copy your API key and paste it in the `.env` file

4. Edit `.env` file and replace `your_api_key_here` with your actual API key:
```
VITE_TMDB_API_KEY=your_actual_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173`

**Note**: This is a client-side only application. All data (user accounts, login information, watchlist) is stored in the browser's localStorage using Svelte stores. No backend server is required.

## Features

- 🎬 **Movie Listings**: Browse popular movies from TMDb
- 🔍 **Search**: Search movies by title
- 📋 **Movie Details**: View detailed information about a movie
- ⭐ **Watchlist**: Add and remove movies to watchlist
- 🔐 **Authentication**: User login and signup
- 🎯 **Filtering**: Filter movies by genre, year, and rating

## Project Details

### Frontend (`/frontend`)

SvelteKit application with:
- Modern UI with Svelte components
- **State management with Svelte stores + browser storage** - **REQUIRED**: Login information and user accounts are stored using Svelte Store + browser storage (localStorage). The `userStore` and `userAccountsStore` automatically persist to browser localStorage.
- Direct TMDb API integration
- Responsive design

**Svelte Concepts Used** (REQUIRED):
- **Store**: Uses Svelte stores (`writable`, `derived`) for state management
  - `userStore` - Current logged-in user (persisted in localStorage)
  - `userAccountsStore` - List of user accounts (persisted in localStorage)
  - `watchlistStore` - User's watchlist movie IDs (persisted in localStorage)
  - `isAuthenticated` - Derived store checking authentication status
- **Binding**: Uses two-way data binding (`bind:value`) in forms
- **Async/await**: All API calls and async operations use async/await pattern
- **Slot**: Uses Svelte slots in layout component (`+layout.svelte`)

**Svelte Store + Browser Storage Implementation** (REQUIRED):
- **`userStore`** - Stores current logged-in user information (email, name, id) using Svelte Store + browser localStorage
- **`userAccountsStore`** - Stores list of user accounts with password hashes using Svelte Store + browser localStorage
- **`watchlistStore`** - Stores user's watchlist movie IDs using Svelte Store + browser localStorage
- All stores use `createPersistentStore()` which automatically:
  - Loads from browser localStorage on initialization
  - Saves to browser localStorage whenever values change
  - Uses Svelte reactive stores for automatic UI updates

## Development

### Frontend Development

```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run check       # Type check
```

## Production Deployment

1. Build the application:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to a static hosting service (Vercel, Netlify, etc.)
3. Set `VITE_TMDB_API_KEY` environment variable in your hosting platform

## Environment Variables

### Frontend (.env)
- `VITE_TMDB_API_KEY` - TMDb API key (required)

## TMDb API Integration

The application uses the TMDb API directly from the frontend:
- Popular movies: `/movie/popular`
- Search movies: `/search/movie`
- Movie details: `/movie/{id}`
- Discover movies: `/discover/movie` (with filters)
- Genres: `/genre/movie/list`

All API calls are made directly from the browser using the TMDb API key stored in environment variables.

## Notes

- **Client-side only**: No backend server required. All data is stored in browser localStorage.
- **Authentication**: User accounts and login information are stored using Svelte stores with localStorage persistence.
- **Password Storage**: Passwords are hashed using a simple hash function (for demo purposes). In production, use a proper hashing library.
- **Watchlist**: Stored entirely in browser localStorage via Svelte stores. Each user's watchlist is stored locally.
- **REQUIRED: Login information and user accounts are stored using Svelte Store + browser storage (localStorage)** - The `userStore` and `userAccountsStore` use Svelte stores that automatically persist to browser localStorage. All login and account data is stored locally in the browser.

## License

Created for assessment purposes.
