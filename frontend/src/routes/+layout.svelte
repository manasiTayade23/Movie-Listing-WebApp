<script lang="ts">
	import '../app.css';
	import { browser } from '$app/environment';
	import { userStore, watchlistStore } from '$lib/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import { onMount } from 'svelte';

	// Stores automatically load from localStorage on creation via createPersistentStore
	// No backend initialization needed - all data is stored client-side using Svelte stores
	onMount(() => {
		if (!browser) return;

		// Subscribe to user changes to clear watchlist on logout
		const unsubscribe = userStore.subscribe((user) => {
			if (!user) {
				// Clear watchlist when user logs out
				watchlistStore.set([]);
			}
		});

		return () => {
			unsubscribe();
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

