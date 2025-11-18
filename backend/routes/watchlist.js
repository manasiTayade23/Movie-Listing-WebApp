/**
 * Watchlist Routes
 */

import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../db/watchlist.js';
import { getMovieDetails } from '../api/tmdb.js';

const router = express.Router();

// All watchlist routes require authentication
router.use(requireAuth);

/**
 * GET /api/watchlist
 */
router.get('/', async (req, res) => {
	try {
		const movieIds = await getWatchlist(req.session.userId);

		// Fetch movie details for all watchlist items
		const movies = await Promise.all(
			movieIds.map((id) => getMovieDetails(id).catch(() => null))
		);

		// Filter out any failed requests
		const validMovies = movies.filter((movie) => movie !== null);

		res.json({ movies: validMovies });
	} catch (error) {
		console.error('Error fetching watchlist:', error);
		res.status(500).json({ error: 'Failed to fetch watchlist' });
	}
});

/**
 * POST /api/watchlist
 */
router.post('/', async (req, res) => {
	try {
		const { movieId } = req.body;

		if (!movieId || typeof movieId !== 'number') {
			return res.status(400).json({ error: 'Valid movieId is required' });
		}

		await addToWatchlist(req.session.userId, movieId);

		res.json({ message: 'Movie added to watchlist' });
	} catch (error) {
		console.error('Error adding to watchlist:', error);
		res.status(500).json({ error: 'Failed to add to watchlist' });
	}
});

/**
 * DELETE /api/watchlist/:id
 */
router.delete('/:id', async (req, res) => {
	try {
		const movieId = parseInt(req.params.id);
		if (isNaN(movieId)) {
			return res.status(400).json({ error: 'Invalid movie ID' });
		}

		await removeFromWatchlist(req.session.userId, movieId);

		res.json({ message: 'Movie removed from watchlist' });
	} catch (error) {
		console.error('Error removing from watchlist:', error);
		res.status(500).json({ error: 'Failed to remove from watchlist' });
	}
});

export default router;

