/**
 * TMDb API Configuration
 * 
 * Note: In a production environment, the API key should be stored in environment variables
 * For this assessment, we'll use a placeholder. Users should replace this with their own API key.
 * 
 * Get your free API key from: https://www.themoviedb.org/settings/api
 */

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

/**
 * Check if API key is configured
 */
function checkApiKey() {
	if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
		throw new Error(
			'TMDb API key is not configured. Please create a .env file in the frontend directory with:\n' +
			'VITE_TMDB_API_KEY=your_api_key_here\n\n' +
			'Get your free API key from: https://www.themoviedb.org/settings/api'
		);
	}
}

/**
 * Generic fetch function for TMDb API
 * Uses async/await pattern as required
 */
async function fetchFromTMDB(endpoint: string): Promise<any> {
	// Check API key before making request
	checkApiKey();
	
	const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
	
	const response = await fetch(url);
	
	if (!response.ok) {
		if (response.status === 401) {
			throw new Error(
				'Invalid TMDb API key. Please check your .env file and ensure VITE_TMDB_API_KEY is set correctly.\n' +
				'Get your free API key from: https://www.themoviedb.org/settings/api'
			);
		}
		throw new Error(`TMDb API error: ${response.status} ${response.statusText}`);
	}
	
	return await response.json();
}

/**
 * Get popular movies
 */
export async function getPopularMovies(page: number = 1) {
	return await fetchFromTMDB(`/movie/popular?page=${page}`);
}

/**
 * Search movies by query
 */
export async function searchMovies(query: string, page: number = 1) {
	return await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
}

/**
 * Get movie details by ID
 */
export async function getMovieDetails(movieId: number) {
	return await fetchFromTMDB(`/movie/${movieId}`);
}

/**
 * Get movie genres
 */
export async function getGenres() {
	const data = await fetchFromTMDB('/genre/movie/list');
	return data.genres || [];
}

/**
 * Discover movies with filters
 */
export async function discoverMovies(filters: {
	genre?: number;
	year?: number;
	rating?: number;
	page?: number;
}) {
	const params = new URLSearchParams();
	
	if (filters.genre) params.append('with_genres', filters.genre.toString());
	if (filters.year) params.append('year', filters.year.toString());
	if (filters.rating) params.append('vote_average.gte', filters.rating.toString());
	if (filters.page) params.append('page', filters.page.toString());
	
	return await fetchFromTMDB(`/discover/movie?${params.toString()}`);
}

/**
 * Get image URL for a poster path
 */
export function getImageUrl(posterPath: string | null): string {
	if (!posterPath) {
		return 'https://via.placeholder.com/500x750?text=No+Image';
	}
	return `${IMAGE_BASE_URL}${posterPath}`;
}

/**
 * Get backdrop image URL
 */
export function getBackdropUrl(backdropPath: string | null): string {
	if (!backdropPath) {
		return 'https://via.placeholder.com/1920x1080?text=No+Image';
	}
	return `https://image.tmdb.org/t/p/w1280${backdropPath}`;
}

