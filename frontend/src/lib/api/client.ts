/**
 * API Client for TMDb API communication
 * Handles all HTTP requests directly to TMDb API
 */

import * as tmdbAPI from './tmdb';

/**
 * Movies API - Direct TMDb API calls
 * Uses async/await pattern as required
 */
export const moviesAPI = {
	/**
	 * Get popular movies
	 * Uses async/await pattern as required
	 */
	async getPopular(page: number = 1) {
		return await tmdbAPI.getPopularMovies(page);
	},

	/**
	 * Search movies
	 * Uses async/await pattern as required
	 */
	async search(query: string, page: number = 1) {
		return await tmdbAPI.searchMovies(query, page);
	},

	/**
	 * Get movie details
	 * Uses async/await pattern as required
	 */
	async getDetails(movieId: number) {
		return await tmdbAPI.getMovieDetails(movieId);
	},

	/**
	 * Discover movies with filters
	 * Uses async/await pattern as required
	 */
	async discover(filters: {
		genre?: number;
		year?: number;
		rating?: number;
		page?: number;
	}) {
		return await tmdbAPI.discoverMovies(filters);
	},

	/**
	 * Get genres
	 * Uses async/await pattern as required
	 */
	async getGenres() {
		const genres = await tmdbAPI.getGenres();
		return { genres };
	},
};

/**
 * Watchlist API - Uses Svelte stores (no backend needed)
 * Watchlist is managed entirely through Svelte stores with localStorage persistence
 */
export const watchlistAPI = {
	/**
	 * Get user's watchlist movies
	 * This function fetches movie details from TMDb for IDs in the watchlist store
	 * Uses async/await pattern as required
	 */
	async getWatchlist() {
		// Import watchlistStore dynamically to avoid circular dependencies
		const { watchlistStore } = await import('../stores');
		const { get } = await import('svelte/store');
		
		const watchlistIds = get(watchlistStore);
		const movies = [];
		
		// Fetch movie details for each ID in watchlist
		for (const movieId of watchlistIds) {
			try {
				const movie = await tmdbAPI.getMovieDetails(movieId);
				movies.push(movie);
			} catch (error) {
				console.error(`Failed to fetch movie ${movieId}:`, error);
			}
		}
		
		return { movies };
	},

	/**
	 * Add movie to watchlist
	 * Updates the watchlist store (automatically persists to localStorage)
	 */
	async addMovie(movieId: number) {
		const { watchlistStore } = await import('../stores');
		const { get } = await import('svelte/store');
		
		const currentList = get(watchlistStore);
		if (!currentList.includes(movieId)) {
			watchlistStore.update((list) => [...list, movieId]);
		}
		return { success: true };
	},

	/**
	 * Remove movie from watchlist
	 * Updates the watchlist store (automatically persists to localStorage)
	 */
	async removeMovie(movieId: number) {
		const { watchlistStore } = await import('../stores');
		
		watchlistStore.update((list) => list.filter((id) => id !== movieId));
		return { success: true };
	},
};
