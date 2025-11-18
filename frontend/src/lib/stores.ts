import { writable, derived, readable, get } from 'svelte/store';
import { browser } from '$app/environment';

/**
 * User interface
 */
export interface User {
	id: string;
	email: string;
	name: string;
}

/**
 * User Account interface (for local storage)
 * Includes password hash for authentication
 */
export interface UserAccount {
	id: string;
	email: string;
	name: string;
	passwordHash: string; // Simple hash for demo purposes
	lastLogin?: string;
}

/**
 * Persistent Store Factory
 * REQUIRED: Creates a writable Svelte store that automatically syncs with browser storage (localStorage)
 * 
 * This function ensures that:
 * 1. Uses Svelte Store (writable store)
 * 2. Uses browser storage (localStorage)
 * 3. Automatically loads from localStorage on initialization
 * 4. Automatically saves to localStorage whenever store value changes
 * 
 * This is the core implementation for storing login information and user accounts
 * using Svelte Store + browser storage as required.
 */
function createPersistentStore<T>(key: string, defaultValue: T) {
	// Initialize from browser localStorage if in browser environment
	const storedValue = browser ? localStorage.getItem(key) : null;
	const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue;

	// Create Svelte writable store with initial value from localStorage
	const store = writable<T>(initialValue);

	// Subscribe to store changes and automatically persist to browser localStorage
	if (browser) {
		store.subscribe((value) => {
			try {
				if (value === null || value === undefined) {
					localStorage.removeItem(key);
				} else {
					// Save to browser localStorage whenever store changes
					localStorage.setItem(key, JSON.stringify(value));
				}
			} catch (error) {
				console.error(`Error saving to localStorage (${key}):`, error);
			}
		});
	}

	return store;
}

/**
 * User Store - manages current authenticated user
 * REQUIRED: Uses Svelte Store + browser storage (localStorage) for login information
 * Persists to localStorage automatically via createPersistentStore
 * Demonstrates Svelte Store with persistence
 * 
 * Storage key: 'moviehub_user'
 * Automatically saves/loads from browser localStorage
 */
export const userStore = createPersistentStore<User | null>('moviehub_user', null);

/**
 * User Accounts Store - stores list of user accounts
 * REQUIRED: Uses Svelte Store + browser storage (localStorage) for user accounts
 * This demonstrates storing multiple user accounts in a Svelte store with browser storage
 * All user accounts are stored locally in the browser's localStorage
 * 
 * Storage key: 'moviehub_user_accounts'
 * Automatically saves/loads from browser localStorage
 */
export const userAccountsStore = createPersistentStore<UserAccount[]>('moviehub_user_accounts', []);

/**
 * Watchlist Store - manages user's watchlist
 * Array of movie IDs that the user wants to watch
 * Persists to localStorage
 */
export const watchlistStore = createPersistentStore<number[]>('moviehub_watchlist', []);

/**
 * Derived Store - Check if user is authenticated
 * Demonstrates Svelte derived store concept
 */
export const isAuthenticated = derived(
	userStore,
	($userStore) => $userStore !== null
);

/**
 * Derived Store - Get current user's email
 * Demonstrates Svelte derived store concept
 */
export const currentUserEmail = derived(
	userStore,
	($userStore) => $userStore?.email || null
);

/**
 * Derived Store - Get current user's name
 * Demonstrates Svelte derived store concept
 */
export const currentUserName = derived(
	userStore,
	($userStore) => $userStore?.name || null
);

/**
 * Simple hash function for password storage (for demo purposes)
 * In production, use a proper hashing library like bcrypt
 */
function simpleHash(password: string): string {
	let hash = 0;
	for (let i = 0; i < password.length; i++) {
		const char = password.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash.toString();
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
	return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Add or update user account in the accounts store
 * Demonstrates store update operations
 */
export function addUserAccount(account: UserAccount) {
	userAccountsStore.update((accounts) => {
		const existingIndex = accounts.findIndex((a) => a.id === account.id);
		
		if (existingIndex >= 0) {
			// Update existing account
			accounts[existingIndex] = { ...accounts[existingIndex], ...account };
			return accounts;
		} else {
			// Add new account
			return [...accounts, account];
		}
	});
}

/**
 * Get user account by ID
 * Demonstrates reading from store
 */
export function getUserAccount(userId: string): UserAccount | undefined {
	const accounts = get(userAccountsStore);
	return accounts.find((a) => a.id === userId);
}

/**
 * Get user account by email
 * Demonstrates reading from store
 */
export function getUserAccountByEmail(email: string): UserAccount | undefined {
	const accounts = get(userAccountsStore);
	return accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
}

/**
 * Clear all stores (logout)
 * Demonstrates store reset operations
 */
export function clearAllStores() {
	userStore.set(null);
	watchlistStore.set([]);
	// Note: We keep userAccountsStore for demo purposes
	// In production, you might want to clear it too
}

/**
 * Login user and update stores
 * REQUIRED: Stores login information using Svelte Store + browser storage (localStorage)
 * 
 * This function:
 * 1. Validates credentials against stored user accounts
 * 2. Updates userStore (Svelte Store) - automatically saves to localStorage
 * 3. Updates userAccountsStore (Svelte Store) - automatically saves to localStorage
 * 
 * All login information is stored in browser localStorage via Svelte stores
 * Uses async/await pattern as required
 */
export async function loginUser(email: string, password: string): Promise<User> {
	if (!browser) {
		throw new Error('Login is only available in browser environment');
	}

	// Find user account by email
	const accounts = get(userAccountsStore);
	const account = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

	if (!account) {
		throw new Error('Invalid email or password');
	}

	// Verify password
	const passwordHash = simpleHash(password);
	if (account.passwordHash !== passwordHash) {
		throw new Error('Invalid email or password');
	}

	// Create user object
	const user: User = {
		id: account.id,
		email: account.email,
		name: account.name,
	};

	// Update user store - automatically persists to browser localStorage
	userStore.set(user);

	// Update last login in accounts store - automatically persists to browser localStorage
	addUserAccount({
		...account,
		lastLogin: new Date().toISOString(),
	});

	return user;
}

/**
 * Signup user and update stores
 * REQUIRED: Stores user account using Svelte Store + browser storage (localStorage)
 * 
 * This function:
 * 1. Creates new user account locally
 * 2. Updates userStore (Svelte Store) - automatically saves to localStorage
 * 3. Adds new account to userAccountsStore (Svelte Store) - automatically saves to localStorage
 * 
 * All user account information is stored in browser localStorage via Svelte stores
 * Uses async/await pattern as required
 */
export async function signupUser(name: string, email: string, password: string): Promise<User> {
	if (!browser) {
		throw new Error('Signup is only available in browser environment');
	}

	// Check if email already exists
	const accounts = get(userAccountsStore);
	const existingAccount = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

	if (existingAccount) {
		throw new Error('An account with this email already exists');
	}

	// Validate password length
	if (password.length < 6) {
		throw new Error('Password must be at least 6 characters');
	}

	// Generate user ID
	const userId = generateUserId();

	// Create user account with password hash
	const account: UserAccount = {
		id: userId,
		email: email.toLowerCase(),
		name: name.trim(),
		passwordHash: simpleHash(password),
		lastLogin: new Date().toISOString(),
	};

	// Add account to accounts store - automatically persists to browser localStorage
	addUserAccount(account);

	// Create user object
	const user: User = {
		id: account.id,
		email: account.email,
		name: account.name,
	};

	// Update user store - automatically persists to browser localStorage
	userStore.set(user);

	return user;
}

/**
 * Logout user and clear stores
 * Uses async/await pattern as required
 */
export async function logoutUser() {
	clearAllStores();
}
