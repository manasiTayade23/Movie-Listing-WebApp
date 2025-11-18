import { writable, derived, readable, get } from 'svelte/store';
import { authAPI } from './api/client';
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
 */
export interface UserAccount {
	id: string;
	email: string;
	name: string;
	lastLogin?: string;
}

/**
 * Persistent Store Factory
 * Creates a writable store that automatically syncs with localStorage
 */
function createPersistentStore<T>(key: string, defaultValue: T) {
	// Initialize from localStorage if in browser
	const storedValue = browser ? localStorage.getItem(key) : null;
	const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue;

	// Create writable store
	const store = writable<T>(initialValue);

	// Subscribe to changes and persist to localStorage
	if (browser) {
		store.subscribe((value) => {
			try {
				if (value === null || value === undefined) {
					localStorage.removeItem(key);
				} else {
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
 * Persists to localStorage automatically
 * Demonstrates Svelte Store with persistence
 */
export const userStore = createPersistentStore<User | null>('moviehub_user', null);

/**
 * User Accounts Store - stores list of user accounts (for demo purposes)
 * This demonstrates storing multiple user accounts in a Svelte store
 * In a real app, this would be managed server-side
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
 * Initialize user from backend session
 * Also loads user account information into store
 */
export async function initUser() {
	if (!browser) return;
	
	try {
		const response = await authAPI.getCurrentUser();
		if (response.user) {
			// Update user store
			userStore.set(response.user);
			
			// Add/update user account in accounts store
			addUserAccount({
				id: response.user.id,
				email: response.user.email,
				name: response.user.name,
				lastLogin: new Date().toISOString(),
			});
		} else {
			userStore.set(null);
		}
	} catch (error) {
		// User not authenticated, that's okay
		userStore.set(null);
	}
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
 * Demonstrates store operations with async/await
 */
export async function loginUser(email: string, password: string): Promise<User> {
	const response = await authAPI.login(email, password);
	
	if (response.user) {
		// Update user store
		userStore.set(response.user);
		
		// Add/update user account
		addUserAccount({
			id: response.user.id,
			email: response.user.email,
			name: response.user.name,
			lastLogin: new Date().toISOString(),
		});
	}
	
	return response.user;
}

/**
 * Signup user and update stores
 * Demonstrates store operations with async/await
 */
export async function signupUser(name: string, email: string, password: string): Promise<User> {
	const response = await authAPI.signup(name, email, password);
	
	if (response.user) {
		// Update user store
		userStore.set(response.user);
		
		// Add new user account
		addUserAccount({
			id: response.user.id,
			email: response.user.email,
			name: response.user.name,
			lastLogin: new Date().toISOString(),
		});
	}
	
	return response.user;
}

/**
 * Logout user and clear stores
 */
export async function logoutUser() {
	try {
		await authAPI.logout();
	} catch (error) {
		console.error('Logout error:', error);
	}
	clearAllStores();
}
