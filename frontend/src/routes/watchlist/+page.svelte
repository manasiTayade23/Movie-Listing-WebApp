<script lang="ts">
	import { onMount } from 'svelte';
	import { userStore, watchlistStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { watchlistAPI } from '$lib/api/client';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import MovieFilter from '$lib/components/MovieFilter.svelte';

	let allMovies: any[] = [];
	let loading = true;
	let error = '';
	let filters: {
		genre?: number;
		year?: number;
		rating?: number;
	} = {};

	/**
	 * Load watchlist movies
	 * Uses async/await pattern as required
	 */
	async function loadWatchlistMovies() {
		loading = true;
		error = '';

		try {
			const response = await watchlistAPI.getWatchlist();
			allMovies = response.movies || [];
			
			// Update watchlist store with movie IDs
			watchlistStore.set(allMovies.map(m => m.id));
		} catch (err) {
			error = 'Failed to load watchlist. Please try again later.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	/**
	 * Filter movies based on selected filters
	 * Handles both genre_ids array and genres array with objects
	 */
	function filterMovies(movies: any[]): any[] {
		if (!movies || movies.length === 0) return [];
		
		return movies.filter(movie => {
			// Filter by genre - check both genre_ids array and genres array
			if (filters.genre) {
				let hasGenre = false;
				
				// Check genre_ids array (common in discover/search results)
				if (movie.genre_ids && Array.isArray(movie.genre_ids)) {
					hasGenre = movie.genre_ids.includes(filters.genre);
				}
				
				// Check genres array with objects (common in detailed movie data)
				if (!hasGenre && movie.genres && Array.isArray(movie.genres)) {
					hasGenre = movie.genres.some((g: any) => 
						g.id === filters.genre || (typeof g === 'number' && g === filters.genre)
					);
				}
				
				if (!hasGenre) return false;
			}

			// Filter by year - exact match
			if (filters.year) {
				if (!movie.release_date) return false;
				
				try {
					const movieYear = new Date(movie.release_date).getFullYear();
					if (movieYear !== filters.year) return false;
				} catch (e) {
					// If date parsing fails, exclude the movie
					return false;
				}
			}

			// Filter by rating
			if (filters.rating) {
				const rating = movie.vote_average || 0;
				if (rating < filters.rating) return false;
			}

			return true;
		});
	}

	/**
	 * Get filtered movies
	 */
	$: filteredMovies = filterMovies(allMovies);

	/**
	 * React to watchlist store changes - filter movies to match store
	 */
	$: if ($watchlistStore && allMovies.length > 0) {
		// Filter movies to only show those still in the watchlist store
		// This handles cases where a movie was removed from another page
		allMovies = allMovies.filter(movie => $watchlistStore.includes(movie.id));
	}

	onMount(() => {
		// Redirect to login if not authenticated
		if (!$userStore) {
			goto('/login');
			return;
		}
		
		loadWatchlistMovies();
	});
</script>

<svelte:head>
	<title>My Watchlist - MovieHub</title>
</svelte:head>

<div class="watchlist-page">
	<h1>My Watchlist</h1>

	{#if loading}
		<div class="loading">Loading your watchlist...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else if allMovies.length === 0}
		<div class="empty-watchlist">
			<p>Your watchlist is empty.</p>
			<p>Start adding movies to your watchlist to see them here!</p>
			<a href="/movies" class="browse-link">Browse Movies</a>
		</div>
	{:else}
		<div class="content-layout">
			<aside class="filters-section">
				<MovieFilter bind:filters />
			</aside>

			<main class="movies-main">
				<div class="watchlist-info">
					<p>
						{#if filters.genre || filters.year || filters.rating}
							Showing {filteredMovies.length} of {allMovies.length} {allMovies.length === 1 ? 'movie' : 'movies'}
						{:else}
							You have {allMovies.length} {allMovies.length === 1 ? 'movie' : 'movies'} in your watchlist
						{/if}
					</p>
				</div>

				{#if filteredMovies.length === 0}
					<div class="no-results">
						<p>No movies match your filters. Try adjusting your filters.</p>
					</div>
				{:else}
					<div class="movies-grid">
						{#each filteredMovies as movie (movie.id)}
							<MovieCard {movie} />
						{/each}
					</div>
				{/if}
			</main>
		</div>
	{/if}
</div>

<style>
	.watchlist-page {
		min-height: 100vh;
		padding: 2rem;
		background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
	}

	.watchlist-page h1 {
		margin-bottom: 2rem;
		font-size: 2.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.loading, .error {
		text-align: center;
		padding: 4rem 2rem;
		font-size: 1.2rem;
		color: #ffffff;
	}

	.error {
		color: #ff4444;
	}

	.empty-watchlist {
		text-align: center;
		padding: 4rem 2rem;
		color: #b0b0b0;
	}

	.empty-watchlist p {
		font-size: 1.2rem;
		margin-bottom: 1rem;
	}

	.browse-link {
		display: inline-block;
		margin-top: 1rem;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.browse-link:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
	}

	.content-layout {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 2rem;
		align-items: start;
	}

	.filters-section {
		position: sticky;
		top: 2rem;
	}

	.movies-main {
		min-width: 0;
	}

	.watchlist-info {
		margin-bottom: 2rem;
		color: #b0b0b0;
		font-size: 1.1rem;
	}

	.no-results {
		text-align: center;
		padding: 4rem 2rem;
		color: #b0b0b0;
		font-size: 1.2rem;
	}

	.movies-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 2rem;
	}

	@media (max-width: 1024px) {
		.content-layout {
			grid-template-columns: 1fr;
		}

		.filters-section {
			position: static;
		}
	}

	@media (max-width: 768px) {
		.watchlist-page {
			padding: 1rem;
		}

		.movies-grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 1rem;
		}
	}
</style>

