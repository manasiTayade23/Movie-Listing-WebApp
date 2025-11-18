# MovieHub - Full Stack Movie Listing Application

A full-stack movie listing web application with separate backend and frontend.

## Project Structure

```
SvelteKit/
├── backend/          # Express.js backend API server
├── frontend/         # SvelteKit frontend application
├── README.md         # This file
└── .gitignore        # Git ignore rules
```

## Architecture

- **Backend**: Express.js REST API server (Node.js)
- **Frontend**: SvelteKit application (TypeScript)
- **Communication**: REST API with HTTP-only cookies for sessions

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- TMDb API key (free from [themoviedb.org](https://www.themoviedb.org/settings/api))

### Setup Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and add your TMDb API key:
```
PORT=3001
TMDB_API_KEY=your_api_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Setup Frontend

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` (optional, defaults are fine):
```
VITE_API_URL=http://localhost:3001/api
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Running Both Servers

You need to run both servers simultaneously:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Features

- 🎬 **Movie Listings**: Browse popular movies from TMDb
- 🔍 **Search**: Search movies by title
- 📋 **Movie Details**: View detailed information
- ⭐ **Watchlist**: Add/remove movies to watchlist
- 🔐 **Authentication**: Login and signup
- 🎯 **Filtering**: Filter by genre, year, and rating

## Project Details

### Backend (`/backend`)

Express.js API server with:
- RESTful API endpoints
- Session management with HTTP-only cookies
- TMDb API integration
- In-memory database (replace with real DB in production)

See [backend/README.md](./backend/README.md) for details.

### Frontend (`/frontend`)

SvelteKit application with:
- Modern UI with Svelte components
- State management with Svelte stores
- API client for backend communication
- Responsive design

See [frontend/README.md](./frontend/README.md) for details.

## Development

### Backend Development

```bash
cd backend
npm run dev    # Start with auto-reload
npm start      # Start production server
```

### Frontend Development

```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run check       # Type check
```

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Update `FRONTEND_URL` to your frontend URL
3. Deploy to a Node.js hosting service (Heroku, Railway, etc.)

### Frontend

1. Build the application:
```bash
cd frontend
npm run build
```

2. Deploy the `build` folder to a static hosting service (Vercel, Netlify, etc.)
3. Update `VITE_API_URL` to point to your backend URL

## Environment Variables

### Backend (.env)
- `PORT` - Backend server port (default: 3001)
- `TMDB_API_KEY` - TMDb API key (required)
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001/api)

## API Documentation

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/signup` - Signup
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies/popular` - Popular movies
- `GET /api/movies/search?query=...` - Search movies
- `GET /api/movies/:id` - Movie details
- `GET /api/movies/discover` - Discover with filters
- `GET /api/movies/genres` - Get genres

### Watchlist (Requires Auth)
- `GET /api/watchlist` - Get watchlist
- `POST /api/watchlist` - Add movie
- `DELETE /api/watchlist/:id` - Remove movie

## Notes

- Backend uses in-memory database (data lost on restart)
- Passwords stored in plain text (hash in production)
- Session stored in HTTP-only cookies
- CORS configured for frontend origin

## License

Created for assessment purposes.
