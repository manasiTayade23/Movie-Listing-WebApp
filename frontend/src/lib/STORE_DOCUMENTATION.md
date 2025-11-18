# Svelte Store Documentation

This document explains how Svelte stores are used in the MovieHub application to manage login information and user accounts.

## Store Overview

The application uses multiple Svelte stores to manage state:

1. **userStore** - Current authenticated user
2. **userAccountsStore** - List of user accounts (local storage)
3. **watchlistStore** - User's watchlist
4. **Derived Stores** - Computed values from other stores

## Store Types Demonstrated

### 1. Writable Stores

**userStore** - Stores current logged-in user
```typescript
export const userStore = writable<User | null>(null);
```

**userAccountsStore** - Stores list of user accounts
```typescript
export const userAccountsStore = writable<UserAccount[]>([]);
```

**watchlistStore** - Stores user's watchlist
```typescript
export const watchlistStore = writable<number[]>([]);
```

### 2. Persistent Stores

All stores automatically persist to localStorage:

- `userStore` → `localStorage.getItem('moviehub_user')`
- `userAccountsStore` → `localStorage.getItem('moviehub_user_accounts')`
- `watchlistStore` → `localStorage.getItem('moviehub_watchlist')`

### 3. Derived Stores

**isAuthenticated** - Derived from userStore
```typescript
export const isAuthenticated = derived(
	userStore,
	($userStore) => $userStore !== null
);
```

**currentUserEmail** - Derived from userStore
```typescript
export const currentUserEmail = derived(
	userStore,
	($userStore) => $userStore?.email || null
);
```

**currentUserName** - Derived from userStore
```typescript
export const currentUserName = derived(
	userStore,
	($userStore) => $userStore?.name || null
);
```

## Store Operations

### Reading from Stores

**Using reactive statements ($):**
```svelte
<script>
	import { userStore } from '$lib/stores';
</script>

{#if $userStore}
	<p>Welcome, {$userStore.name}!</p>
{/if}
```

**Using get() function:**
```typescript
import { get, userStore } from '$lib/stores';

const currentUser = get(userStore);
```

### Updating Stores

**Direct update:**
```typescript
userStore.set(newUser);
```

**Update with function:**
```typescript
userStore.update((currentUser) => {
	return { ...currentUser, name: 'New Name' };
});
```

### Subscribing to Stores

```typescript
const unsubscribe = userStore.subscribe((user) => {
	console.log('User changed:', user);
});

// Later, unsubscribe
unsubscribe();
```

## Store Functions

### Authentication Functions

**loginUser(email, password)**
- Logs in user via API
- Updates userStore
- Adds/updates user account in userAccountsStore
- Persists to localStorage

**signupUser(name, email, password)**
- Creates new user via API
- Updates userStore
- Adds new account to userAccountsStore
- Persists to localStorage

**logoutUser()**
- Calls logout API
- Clears userStore and watchlistStore
- Persists changes to localStorage

### Account Management Functions

**addUserAccount(account)**
- Adds or updates user account in userAccountsStore
- Automatically persists to localStorage

**getUserAccount(userId)**
- Retrieves user account by ID from store

**getUserAccountByEmail(email)**
- Retrieves user account by email from store

**clearAllStores()**
- Clears all stores (used on logout)

## Usage Examples

### In Components

```svelte
<script>
	import { userStore, isAuthenticated, currentUserEmail } from '$lib/stores';
	
	// Reactive access
	$: user = $userStore;
	$: loggedIn = $isAuthenticated;
	$: email = $currentUserEmail;
</script>

{#if $isAuthenticated}
	<p>Logged in as: {$currentUserEmail}</p>
{/if}
```

### In Functions

```typescript
import { userStore, loginUser, getUserAccount } from '$lib/stores';
import { get } from 'svelte/store';

// Login
const user = await loginUser(email, password);

// Get current user
const currentUser = get(userStore);

// Get account details
const account = getUserAccount(currentUser.id);
```

## Persistence

All stores automatically:
- **Save to localStorage** when values change
- **Load from localStorage** on page load
- **Clear localStorage** when set to null/empty

## Store Data Structure

### User Store
```typescript
{
	id: string;
	email: string;
	name: string;
}
```

### User Accounts Store
```typescript
[
	{
		id: string;
		email: string;
		name: string;
		lastLogin?: string;
	}
]
```

### Watchlist Store
```typescript
[123, 456, 789] // Array of movie IDs
```

## Benefits of This Approach

1. **Centralized State** - All user data in one place
2. **Reactive Updates** - Components automatically update when stores change
3. **Persistence** - Data survives page refreshes
4. **Type Safety** - TypeScript interfaces for all store data
5. **Derived Values** - Computed values from base stores
6. **Easy Testing** - Stores can be easily mocked/tested

## Best Practices Demonstrated

✅ **Persistent Stores** - Automatic localStorage sync
✅ **Derived Stores** - Computed values from base stores
✅ **Store Functions** - Encapsulated operations
✅ **Type Safety** - TypeScript interfaces
✅ **Reactive Access** - Using $ syntax in components
✅ **Store Updates** - Using update() for complex changes

