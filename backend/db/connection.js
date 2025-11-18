/**
 * PostgreSQL Database Connection
 */

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
	console.error('❌ DATABASE_URL is not set in .env file');
	console.error('Please set DATABASE_URL in your .env file:');
	console.error('DATABASE_URL=postgresql://username:password@host:port/database');
	process.exit(1);
}

// Parse connection string to validate format
try {
	const url = new URL(process.env.DATABASE_URL);
	if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') {
		throw new Error('Invalid protocol. Must be postgresql:// or postgres://');
	}
} catch (error) {
	console.error('❌ Invalid DATABASE_URL format:', error.message);
	console.error('Expected format: postgresql://username:password@host:port/database');
	process.exit(1);
}

// Create connection pool
const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test connection
pool.on('connect', () => {
	console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
	console.error('❌ Unexpected error on idle client', err);
	// Don't exit in production, just log the error
	if (process.env.NODE_ENV !== 'production') {
		process.exit(-1);
	}
});

// Test connection on startup
pool.query('SELECT NOW()')
	.then(() => {
		console.log('✅ Database connection test successful');
	})
	.catch((err) => {
		console.error('❌ Database connection failed:', err.message);
		console.error('Please check:');
		console.error('1. PostgreSQL is running');
		console.error('2. DATABASE_URL in .env is correct');
		console.error('3. Database exists and user has permissions');
		process.exit(1);
	});

export default pool;

