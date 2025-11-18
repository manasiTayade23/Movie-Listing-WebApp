<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { userStore, watchlistStore, initUser } from '$lib/stores';
	import { watchlistAPI } from '$lib/api/client';
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';

	// Initialize user from backend session and load watchlist
	// Stores automatically load from localStorage on creation
	onMount(() => {
		if (!browser) return;

		let unsubscribe: () => void;

		const loadWatchlist = async () => {
			try {
				const response = await watchlistAPI.getWatchlist();
				watchlistStore.set(response.movies.map((m) => m.id));
			} catch (error) {
				// Watchlist might be empty, that's okay
				watchlistStore.set([]);
			}
		};

		// Initialize user from backend (stores already loaded from localStorage)
		initUser().then(() => {
			// Subscribe to user changes to sync watchlist
			unsubscribe = userStore.subscribe((user) => {
				if (user) {
					loadWatchlist();
				} else {
					watchlistStore.set([]);
				}
			});
		});

		return () => {
			unsubscribe?.();
		};
	});
</script>

<Navbar />
<main>
	<slot />
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background-color: #0f0f0f;
		color: #ffffff;
		min-height: 100vh;
	}

	main {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}
</style>

