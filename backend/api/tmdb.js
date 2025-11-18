/**
 * TMDb API Integration (Backend)
 */
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY || 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Generic fetch function for TMDb API
 */
async function fetchFromTMDB(endpoint) {
	const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${API_KEY}`;
	
	const response = await fetch(url);
	
	if (!response.ok) {
		throw new Error(`TMDb API error: ${response.statusText}`);
	}
	
	return await response.json();
}

/**
 * Get popular movies
 */
export async function getPopularMovies(page = 1) {
	return await fetchFromTMDB(`/movie/popular?page=${page}`);
}

/**
 * Search movies by query
 */
export async function searchMovies(query, page = 1) {
	return await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
}

/**
 * Get movie details by ID
 */
export async function getMovieDetails(movieId) {
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
export async function discoverMovies(filters) {
	const params = new URLSearchParams();
	
	if (filters.genre) params.append('with_genres', filters.genre.toString());
	if (filters.year) params.append('year', filters.year.toString());
	if (filters.rating) params.append('vote_average.gte', filters.rating.toString());
	if (filters.page) params.append('page', filters.page.toString());
	
	return await fetchFromTMDB(`/discover/movie?${params.toString()}`);
}

