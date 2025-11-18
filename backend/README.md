# MovieHub Backend

Express.js backend API server for MovieHub application with PostgreSQL database (Docker).

## Features

- RESTful API endpoints
- User authentication with session cookies
- Password hashing with bcrypt
- PostgreSQL database (via Docker)
- Movie data from TMDb API
- Watchlist management
- CORS enabled for frontend communication

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- TMDb API key

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL with Docker

```bash
npm run docker:up
```

This starts PostgreSQL in a Docker container with:
- Username: `moviehub`
- Password: `moviehub_password`
- Database: `moviehub`
- Port: `5432`

### 3. Configure Environment Variables

Create `.env` file (already configured for Docker):
```bash
cp .env.example .env
```

The default `.env` is already set for Docker PostgreSQL:
```env
DATABASE_URL=postgresql://moviehub:moviehub_password@localhost:5432/moviehub
```

### 4. Run Database Migration

```bash
npm run migrate
```

This creates the `users` and `watchlist` tables.

### 5. Start the Server

```bash
npm run dev
```

The server will run on `http://localhost:3001`

## Docker Commands

```bash
# Start PostgreSQL
npm run docker:up

# Stop PostgreSQL
npm run docker:down

# View logs
npm run docker:logs

# Reset database (deletes all data)
npm run docker:reset
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies/popular` - Get popular movies
- `GET /api/movies/search?query=...` - Search movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/discover` - Discover movies with filters
- `GET /api/movies/genres` - Get movie genres

### Watchlist (Requires Authentication)
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `DELETE /api/watchlist/:id` - Remove movie from watchlist

## Project Structure

```
backend/
├── api/
│   └── tmdb.js          # TMDb API integration
├── db/
│   ├── connection.js    # PostgreSQL connection pool
│   ├── users.js         # User database operations
│   ├── watchlist.js     # Watchlist database operations
│   ├── schema.sql       # Database schema
│   └── migrate.js       # Migration script
├── middleware/
│   └── auth.js          # Authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── movies.js        # Movie routes
│   └── watchlist.js     # Watchlist routes
├── docker-compose.yml   # Docker PostgreSQL setup
├── server.js            # Express server
└── package.json         # Dependencies
```

## Database Schema

### Users Table
- `id` - Primary key (SERIAL)
- `name` - User's name
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `created_at` - Timestamp

### Watchlist Table
- `id` - Primary key (SERIAL)
- `user_id` - Foreign key to users table
- `movie_id` - TMDb movie ID
- `created_at` - Timestamp
- Unique constraint on (user_id, movie_id)

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt (10 salt rounds)
- **Session Management**: HTTP-only cookies for secure session storage
- **SQL Injection Protection**: Using parameterized queries
- **CORS**: Configured for frontend origin only

## Troubleshooting

### Docker Issues

**Container won't start:**
```bash
docker-compose logs postgres
docker-compose down -v
docker-compose up -d
```

**Port 5432 already in use:**
- Stop local PostgreSQL: `sudo systemctl stop postgresql`
- Or change port in `docker-compose.yml`

**Connection fails:**
- Wait a few seconds after starting container
- Check container is running: `docker ps`
- Verify DATABASE_URL in `.env`

### Database Issues

**Migration fails:**
- Ensure Docker container is running
- Check DATABASE_URL is correct
- Try: `npm run docker:reset` then `npm run migrate`

**Connection errors:**
- Container might still be initializing (wait 5-10 seconds)
- Check logs: `npm run docker:logs`

## Development

- Database resets: Use `npm run docker:reset` to start fresh
- Test users: Create through signup endpoint
- Watchlist: Automatically linked to user accounts

## Production Notes

- Change Docker password in `docker-compose.yml`
- Use environment variables for all sensitive data
- Set `NODE_ENV=production`
- Use SSL for PostgreSQL connection
- Set up database backups
- Consider using a managed PostgreSQL service

## Documentation

- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Detailed Docker setup guide
- [SETUP_POSTGRES.md](./SETUP_POSTGRES.md) - Local PostgreSQL setup (alternative)
