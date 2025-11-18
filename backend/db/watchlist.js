/**
 * Watchlist Database (PostgreSQL)
 * Handles user watchlist operations
 */

import pool from './connection.js';

/**
 * Get user's watchlist
 */
export async function getWatchlist(userId) {
	try {
		const result = await pool.query(
			'SELECT movie_id FROM watchlist WHERE user_id = $1 ORDER BY created_at DESC',
			[userId]
		);
		return result.rows.map(row => row.movie_id);
	} catch (error) {
		console.error('Error getting watchlist:', error);
		throw error;
	}
}

/**
 * Add movie to user's watchlist
 */
export async function addToWatchlist(userId, movieId) {
	try {
		await pool.query(
			'INSERT INTO watchlist (user_id, movie_id) VALUES ($1, $2) ON CONFLICT (user_id, movie_id) DO NOTHING',
			[userId, movieId]
		);
	} catch (error) {
		console.error('Error adding to watchlist:', error);
		throw error;
	}
}

/**
 * Remove movie from user's watchlist
 */
export async function removeFromWatchlist(userId, movieId) {
	try {
		await pool.query(
			'DELETE FROM watchlist WHERE user_id = $1 AND movie_id = $2',
			[userId, movieId]
		);
	} catch (error) {
		console.error('Error removing from watchlist:', error);
		throw error;
	}
}

/**
 * Check if movie is in user's watchlist
 */
export async function isInWatchlist(userId, movieId) {
	try {
		const result = await pool.query(
			'SELECT 1 FROM watchlist WHERE user_id = $1 AND movie_id = $2 LIMIT 1',
			[userId, movieId]
		);
		return result.rows.length > 0;
	} catch (error) {
		console.error('Error checking watchlist:', error);
		throw error;
	}
}

/**
 * Clear user's watchlist
 */
export async function clearWatchlist(userId) {
	try {
		await pool.query(
			'DELETE FROM watchlist WHERE user_id = $1',
			[userId]
		);
	} catch (error) {
		console.error('Error clearing watchlist:', error);
		throw error;
	}
}
