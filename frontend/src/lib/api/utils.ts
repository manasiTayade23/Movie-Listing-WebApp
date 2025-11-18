/**
 * Image URL utilities
 * These are frontend-only utilities for displaying images
 */

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

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

