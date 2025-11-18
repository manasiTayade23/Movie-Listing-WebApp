/**
 * Authentication Middleware
 */

import { findUserById } from '../db/users.js';

/**
 * Get session from request
 */
export async function getSession(req) {
	const sessionCookie = req.cookies.session;
	if (!sessionCookie) {
		return null;
	}

	try {
		const session = JSON.parse(sessionCookie);
		// Verify user still exists
		const user = await findUserById(session.userId);
		if (!user) {
			return null;
		}
		return {
			userId: user.id,
			email: user.email,
			name: user.name,
		};
	} catch {
		return null;
	}
}

/**
 * Require authentication middleware
 */
export async function requireAuth(req, res, next) {
	try {
		const session = await getSession(req);
		if (!session) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		req.session = session;
		next();
	} catch (error) {
		console.error('Auth middleware error:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
}

