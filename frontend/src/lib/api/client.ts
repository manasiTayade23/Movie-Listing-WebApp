/**
 * API Client for backend communication
 * Handles all HTTP requests to the backend API
 */

// Backend API base URL - change this if backend is deployed elsewhere
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const response = await fetch(`${API_BASE}${endpoint}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options.headers,
		},
		credentials: 'include', // Include cookies for session management
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({ message: 'An error occurred' }));
		const errorMessage = error.error || error.message || `HTTP error! status: ${response.status}`;
		const customError = new Error(errorMessage);
		(customError as any).status = response.status;
		throw customError;
	}

	return await response.json();
}

/**
 * Authentication API
 */
export const authAPI = {
	/**
	 * Login user
	 */
	async login(email: string, password: string) {
		return apiRequest<{ user: any }>('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});
	},

	/**
	 * Signup new user
	 */
	async signup(name: string, email: string, password: string) {
		return apiRequest<{ user: any }>('/auth/signup', {
			method: 'POST',
			body: JSON.stringify({ name, email, password }),
		});
	},

	/**
	 * Logout user
	 */
	async logout() {
		return apiRequest('/auth/logout', {
			method: 'POST',
		});
	},

	/**
	 * Get current user
	 */
	async getCurrentUser() {
		return apiRequest<{ user: any }>('/auth/me');
	},
};

/**
 * Movies API
 */
export const moviesAPI = {
	/**
	 * Get popular movies
	 */
	async getPopular(page: number = 1) {
		return apiRequest<{ results: any[]; total_pages: number }>(`/movies/popular?page=${page}`);
	},

	/**
	 * Search movies
	 */
	async search(query: string, page: number = 1) {
		return apiRequest<{ results: any[]; total_pages: number }>(
			`/movies/search?query=${encodeURIComponent(query)}&page=${page}`
		);
	},

	/**
	 * Get movie details
	 */
	async getDetails(movieId: number) {
		return apiRequest<any>(`/movies/${movieId}`);
	},

	/**
	 * Discover movies with filters
	 */
	async discover(filters: {
		genre?: number;
		year?: number;
		rating?: number;
		page?: number;
	}) {
		const params = new URLSearchParams();
		if (filters.genre) params.append('genre', filters.genre.toString());
		if (filters.year) params.append('year', filters.year.toString());
		if (filters.rating) params.append('rating', filters.rating.toString());
		if (filters.page) params.append('page', filters.page.toString());

		const url = `/movies/discover?${params.toString()}`;
		console.log('API discover call - filters:', filters, 'URL params:', params.toString(), 'Full URL:', url);
		return apiRequest<{ results: any[]; total_pages: number }>(url);
	},

	/**
	 * Get genres
	 */
	async getGenres() {
		return apiRequest<{ genres: any[] }>('/movies/genres');
	},
};

/**
 * Watchlist API
 */
export const watchlistAPI = {
	/**
	 * Get user's watchlist
	 */
	async getWatchlist() {
		return apiRequest<{ movies: any[] }>('/watchlist');
	},

	/**
	 * Add movie to watchlist
	 */
	async addMovie(movieId: number) {
		return apiRequest('/watchlist', {
			method: 'POST',
			body: JSON.stringify({ movieId }),
		});
	},

	/**
	 * Remove movie from watchlist
	 */
	async removeMovie(movieId: number) {
		return apiRequest(`/watchlist/${movieId}`, {
			method: 'DELETE',
		});
	},
};
