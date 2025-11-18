/**
 * Movies Routes
 */

import express from 'express';
import {
	getPopularMovies,
	searchMovies,
	getMovieDetails,
	getGenres,
	discoverMovies,
} from '../api/tmdb.js';

const router = express.Router();

/**
 * GET /api/movies/popular
 */
router.get('/popular', async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const data = await getPopularMovies(page);
		res.json(data);
	} catch (error) {
		console.error('Error fetching popular movies:', error);
		res.status(500).json({ error: 'Failed to fetch popular movies' });
	}
});

/**
 * GET /api/movies/search
 */
router.get('/search', async (req, res) => {
	try {
		const query = req.query.query;
		const page = parseInt(req.query.page) || 1;

		if (!query) {
			return res.status(400).json({ error: 'Query parameter is required' });
		}

		const data = await searchMovies(query, page);
		res.json(data);
	} catch (error) {
		console.error('Error searching movies:', error);
		res.status(500).json({ error: 'Failed to search movies' });
	}
});

/**
 * GET /api/movies/discover
 */
router.get('/discover', async (req, res) => {
	try {
		const filters = {};
		if (req.query.genre) filters.genre = parseInt(req.query.genre);
		if (req.query.year) filters.year = parseInt(req.query.year);
		if (req.query.rating) filters.rating = parseFloat(req.query.rating);
		if (req.query.page) filters.page = parseInt(req.query.page);

		const data = await discoverMovies(filters);
		res.json(data);
	} catch (error) {
		console.error('Error discovering movies:', error);
		res.status(500).json({ error: 'Failed to discover movies' });
	}
});

/**
 * GET /api/movies/genres
 */
router.get('/genres', async (req, res) => {
	try {
		const genres = await getGenres();
		res.json({ genres });
	} catch (error) {
		console.error('Error fetching genres:', error);
		res.status(500).json({ error: 'Failed to fetch genres' });
	}
});

/**
 * GET /api/movies/:id
 */
router.get('/:id', async (req, res) => {
	try {
		const movieId = parseInt(req.params.id);
		if (isNaN(movieId)) {
			return res.status(400).json({ error: 'Invalid movie ID' });
		}

		const data = await getMovieDetails(movieId);
		res.json(data);
	} catch (error) {
		console.error('Error fetching movie details:', error);
		res.status(500).json({ error: 'Failed to fetch movie details' });
	}
});

export default router;

