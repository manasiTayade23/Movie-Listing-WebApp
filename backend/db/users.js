/**
 * User Database (PostgreSQL)
 * Handles user authentication with hashed passwords
 */

import pool from './connection.js';
import bcrypt from 'bcrypt';

/**
 * Find user by email
 */
export async function findUserByEmail(email) {
	try {
		const result = await pool.query(
			'SELECT id, name, email, password_hash, created_at FROM users WHERE email = $1',
			[email.toLowerCase()]
		);
		return result.rows[0] || null;
	} catch (error) {
		console.error('Error finding user by email:', error);
		throw error;
	}
}

/**
 * Find user by ID
 */
export async function findUserById(id) {
	try {
		const result = await pool.query(
			'SELECT id, name, email, password_hash, created_at FROM users WHERE id = $1',
			[id]
		);
		return result.rows[0] || null;
	} catch (error) {
		console.error('Error finding user by ID:', error);
		throw error;
	}
}

/**
 * Create new user with hashed password
 */
export async function createUser(name, email, password) {
	try {
		// Check if user already exists
		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			throw new Error('User with this email already exists');
		}

		// Hash password
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		// Insert user into database
		const result = await pool.query(
			'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
			[name, email.toLowerCase(), passwordHash]
		);

		return result.rows[0];
	} catch (error) {
		if (error.message?.includes('already exists')) {
			throw error;
		}
		console.error('Error creating user:', error);
		throw new Error('Failed to create user');
	}
}

/**
 * Verify user credentials
 */
export async function verifyUser(email, password) {
	try {
		const user = await findUserByEmail(email);
		
		if (!user) {
			return null;
		}

		// Compare password with hash
		const isPasswordValid = await bcrypt.compare(password, user.password_hash);
		
		if (!isPasswordValid) {
			return null;
		}

		// Return user without password hash
		return {
			id: user.id,
			name: user.name,
			email: user.email,
			created_at: user.created_at,
		};
	} catch (error) {
		console.error('Error verifying user:', error);
		throw error;
	}
}

/**
 * Get all users (for debugging/admin purposes)
 * Note: Does not return password hashes
 */
export async function getAllUsers() {
	try {
		const result = await pool.query(
			'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC'
		);
		return result.rows;
	} catch (error) {
		console.error('Error getting all users:', error);
		throw error;
	}
}
