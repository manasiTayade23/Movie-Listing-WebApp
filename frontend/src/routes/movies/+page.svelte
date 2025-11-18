<script lang="ts">
	import { onMount } from 'svelte';
	import { userStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { moviesAPI } from '$lib/api/client';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import MovieFilter from '$lib/components/MovieFilter.svelte';

	let allMovies: any[] = [];
	let loading = true;
	let error = '';
	let searchQuery = '';
	let filters: {
		genre?: number;
		year?: number;
		rating?: number;
	} = {};
	let isInitialLoad = true;

	/**
	 * Filter movies based on selected filters (client-side filtering)
	 * This ensures exact matches even if API returns approximate results
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
	$: movies = filterMovies(allMovies);

	/**
	 * Load movies based on current filters and search query
	 * Uses async/await pattern as required
	 */
	async function loadMovies() {
		loading = true;
		error = '';

		try {
			let data;
			
			if (searchQuery.trim()) {
				// Search movies
				data = await moviesAPI.search(searchQuery.trim());
			} else if (filters.genre || filters.year || filters.rating) {
				// Filter movies
				console.log('Loading movies with filters:', filters);
				data = await moviesAPI.discover(filters);
				console.log('Received movies:', data.results?.length, 'movies');
			} else {
				// Get popular movies
				data = await moviesAPI.getPopular();
			}
			
			allMovies = data.results || [];
		} catch (err) {
			error = 'Failed to load movies. Please try again later.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	/**
	 * Handle search input with debouncing
	 */
	let searchTimeout: ReturnType<typeof setTimeout>;
	function handleSearch() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			loadMovies();
		}, 500);
	}

	/**
	 * Handle filter changes with minimal debouncing for dynamic feel
	 */
	let filterTimeout: ReturnType<typeof setTimeout>;
	function handleFilterChange() {
		clearTimeout(filterTimeout);
		filterTimeout = setTimeout(() => {
			if (!searchQuery.trim()) {
				loadMovies();
			}
		}, 50); // Reduced debounce for more dynamic feel
	}

	/**
	 * React to filter changes using reactive statements
	 * Only trigger when filters change and search query is empty
	 * Create a reactive key from filter values to ensure changes are detected
	 */
	$: filterKey = `${filters.genre || ''}-${filters.year || ''}-${filters.rating || ''}`;
	$: if (!searchQuery.trim() && !isInitialLoad) {
		console.log('Filter changed, key:', filterKey, 'filters:', filters);
		handleFilterChange();
	}

	onMount(() => {
		// Redirect to login if not authenticated
		if (!$userStore) {
			goto('/login');
			return;
		}
		
		loadMovies().then(() => {
			isInitialLoad = false;
		});
	});
</script>

<svelte:head>
	<title>Movies - MovieHub</title>
</svelte:head>

<div class="movies-page">
	<div class="page-header">
		<h1>Browse Movies</h1>
	</div>

	<div class="search-container">
		<input 
			type="text" 
			placeholder="Search for movies..."
			bind:value={searchQuery}
			on:input={handleSearch}
			class="search-input"
		/>
	</div>

	<div class="content-layout">
		<aside class="filters-section">
			<MovieFilter bind:filters on:filterChange={() => {
				if (!searchQuery.trim() && !isInitialLoad) {
					handleFilterChange();
				}
			}} />
		</aside>

		<main class="movies-main">
			{#if loading}
				<div class="loading">Loading movies...</div>
			{:else if error}
				<div class="error">{error}</div>
			{:else if movies.length === 0}
				<div class="no-results">
					<p>No movies found. Try adjusting your search or filters.</p>
					{#if allMovies.length > 0}
						<p class="filter-info">
							Found {allMovies.length} movies from API, but none match your current filters.
						</p>
					{/if}
				</div>
			{:else}
				{#if filters.genre || filters.year || filters.rating}
					<div class="results-info">
						Showing {movies.length} {movies.length === 1 ? 'movie' : 'movies'}
						{#if allMovies.length !== movies.length}
							<span class="filtered-count">(filtered from {allMovies.length} results)</span>
						{/if}
					</div>
				{/if}
				<div class="movies-grid">
					{#each movies as movie (movie.id)}
						<MovieCard {movie} />
					{/each}
				</div>
			{/if}
		</main>
	</div>
</div>

<style>
	.movies-page {
		min-height: 100vh;
		padding: 2rem;
		background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 100%);
	}

	.page-header {
		margin-bottom: 2rem;
	}

	.movies-page h1 {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 700;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-align: center;
	}

	.search-container {
		margin-bottom: 2rem;
	}

	.content-layout {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 2rem;
		align-items: start;
	}

	.filters-section {
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.search-input {
		width: 100%;
		padding: 1rem 1.5rem;
		background: rgba(26, 26, 26, 0.8);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(102, 126, 234, 0.3);
		border-radius: 12px;
		color: white;
		font-size: 1.1rem;
		box-sizing: border-box;
		transition: all 0.3s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
	}

	.search-input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.search-input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4);
		background: rgba(26, 26, 26, 0.95);
	}

	.movies-main {
		width: 100%;
	}

	.loading, .error, .no-results {
		text-align: center;
		padding: 4rem 2rem;
		font-size: 1.2rem;
		color: #b0b0b0;
		background: rgba(26, 26, 26, 0.5);
		border-radius: 12px;
		backdrop-filter: blur(10px);
	}

	.error {
		color: #ff6b6b;
		background: rgba(255, 107, 107, 0.1);
		border: 1px solid rgba(255, 107, 107, 0.3);
	}

	.no-results {
		color: #b0b0b0;
	}

	.filter-info {
		font-size: 0.9rem;
		margin-top: 0.5rem;
		color: #888;
		font-style: italic;
	}

	.results-info {
		margin-bottom: 1.5rem;
		color: #b0b0b0;
		font-size: 1.1rem;
		padding: 1rem;
		background: rgba(26, 26, 26, 0.5);
		border-radius: 8px;
		border-left: 3px solid #667eea;
	}

	.filtered-count {
		font-size: 0.9rem;
		color: #888;
		margin-left: 0.5rem;
	}

	.movies-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 2rem;
		padding: 1rem 0;
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
		.movies-page {
			padding: 1rem;
		}

		.movies-page h1 {
			font-size: 2rem;
		}

		.top-section {
			gap: 1.5rem;
		}

		.movies-grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 1.5rem;
		}
	}

	@media (max-width: 480px) {
		.movies-grid {
			grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
			gap: 1rem;
		}
	}
</style>

