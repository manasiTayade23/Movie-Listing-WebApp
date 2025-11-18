<script lang="ts">
	import { userStore, watchlistStore, logoutUser, currentUserEmail } from '$lib/stores';
	import { goto } from '$app/navigation';

	/**
	 * Handle user logout
	 * Uses Svelte store function to clear all stores
	 */
	async function handleLogout() {
		await logoutUser();
		goto('/login');
	}
</script>

<nav>
	<div class="nav-container">
		<a href="/" class="logo">MovieHub</a>
		
		<div class="nav-links">
			{#if $userStore}
				<a href="/movies">Movies</a>
				<a href="/watchlist">
					Watchlist
					{#if $watchlistStore.length > 0}
						<span class="badge">{$watchlistStore.length}</span>
					{/if}
				</a>
				<span class="user-email">{$currentUserEmail || $userStore?.email}</span>
				<button on:click={handleLogout} class="logout-btn">Logout</button>
			{:else}
				<a href="/login">Login</a>
				<a href="/signup">Sign Up</a>
			{/if}
		</div>
	</div>
</nav>

<style>
	nav {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 1rem 0;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.nav-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		color: white;
		text-decoration: none;
	}

	.nav-links {
		display: flex;
		gap: 1.5rem;
		align-items: center;
	}

	.nav-links a {
		color: white;
		text-decoration: none;
		font-weight: 500;
		transition: opacity 0.2s;
		position: relative;
	}

	.nav-links a:hover {
		opacity: 0.8;
	}

	.user-email {
		color: white;
		font-size: 0.9rem;
		opacity: 0.9;
	}

	.logout-btn {
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		cursor: pointer;
		font-weight: 500;
		transition: background 0.2s;
	}

	.logout-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.badge {
		background: #ff4444;
		color: white;
		border-radius: 10px;
		padding: 0.2rem 0.5rem;
		font-size: 0.75rem;
		margin-left: 0.5rem;
	}
</style>

