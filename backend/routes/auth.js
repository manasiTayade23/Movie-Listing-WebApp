/**
 * Authentication Routes
 */

import express from 'express';
import { verifyUser, createUser } from '../db/users.js';

const router = express.Router();

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ error: 'Email and password are required' });
		}

		const user = await verifyUser(email, password);

		if (!user) {
			return res.status(401).json({ error: 'Invalid email or password' });
		}

		// Create session cookie
		const session = {
			userId: user.id,
			email: user.email,
			name: user.name,
		};

		res.cookie('session', JSON.stringify(session), {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
		});

		res.json({
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ error: 'An error occurred during login' });
	}
});

/**
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ error: 'Name, email, and password are required' });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: 'Password must be at least 6 characters' });
		}

		const user = await createUser(name, email, password);

		// Create session cookie
		const session = {
			userId: user.id,
			email: user.email,
			name: user.name,
		};

		res.cookie('session', JSON.stringify(session), {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
		});

		res.json({
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		if (error.message?.includes('already exists')) {
			return res.status(409).json({ error: error.message });
		}
		console.error('Signup error:', error);
		res.status(500).json({ error: 'An error occurred during signup' });
	}
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', (req, res) => {
	res.clearCookie('session');
	res.json({ message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 */
router.get('/me', async (req, res) => {
	const sessionCookie = req.cookies.session;
	if (!sessionCookie) {
		return res.status(401).json({ error: 'Not authenticated' });
	}

	try {
		const session = JSON.parse(sessionCookie);
		// Verify user still exists in database
		const { findUserById } = await import('../db/users.js');
		const user = await findUserById(session.userId);
		
		if (!user) {
			return res.status(401).json({ error: 'Invalid session' });
		}
		
		res.json({ 
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			}
		});
	} catch (error) {
		console.error('Error in /me endpoint:', error);
		res.status(401).json({ error: 'Invalid session' });
	}
});

export default router;

