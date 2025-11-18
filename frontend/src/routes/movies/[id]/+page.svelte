<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { userStore, watchlistStore } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { moviesAPI, watchlistAPI } from '$lib/api/client';
	import { getImageUrl, getBackdropUrl } from '$lib/api/utils';
	import Button from '$lib/components/Button.svelte';

	let movie: any = null;
	let loading = true;
	let error = '';

	/**
	 * Load movie details
	 * Uses async/await pattern as required
	 */
	async function loadMovieDetails() {
		loading = true;
		error = '';

		try {
			const id = $page.params.id;
			if (!id) {
				throw new Error('Movie ID is required');
			}
			
			const movieId = parseInt(id);
			if (isNaN(movieId)) {
				throw new Error('Invalid movie ID');
			}

			movie = await moviesAPI.getDetails(movieId);
		} catch (err) {
			error = 'Failed to load movie details. Please try again later.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	/**
	 * Toggle movie in watchlist
	 */
	async function toggleWatchlist() {
		if (!movie) return;
		
		// Redirect to login if not authenticated
		if (!$userStore) {
			goto('/login');
			return;
		}
		
		try {
			if (isInWatchlist) {
				// Remove from watchlist
				await watchlistAPI.removeMovie(movie.id);
				watchlistStore.update((list) => {
					const updated = list.filter((id) => id !== movie.id);
					return updated;
				});
			} else {
				// Add to watchlist
				await watchlistAPI.addMovie(movie.id);
				watchlistStore.update((list) => {
					if (!list.includes(movie.id)) {
						return [...list, movie.id];
					}
					return list;
				});
			}
		} catch (error: any) {
			console.error('Error updating watchlist:', error);
			alert('Failed to update watchlist. Please try again.');
			// If unauthorized, redirect to login
			if (error.message?.includes('Unauthorized') || error.message?.includes('401')) {
				goto('/login');
			}
		}
	}

	/**
	 * Check if movie is in watchlist
	 */
	$: isInWatchlist = movie ? $watchlistStore.includes(movie.id) : false;

	onMount(() => {
		// Redirect to login if not authenticated
		if (!$userStore) {
			goto('/login');
			return;
		}
		
		loadMovieDetails();
	});
</script>

<svelte:head>
	<title>{movie ? movie.title : 'Movie Details'} - MovieHub</title>
</svelte:head>

{#if loading}
	<div class="loading">Loading movie details...</div>
{:else if error}
	<div class="error">{error}</div>
{:else if movie}
	<div class="movie-details">
		<div 
			class="backdrop" 
			style="background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url({getBackdropUrl(movie.backdrop_path)})"
		>
			<div class="backdrop-content">
				<a href="/movies" class="back-button">← Back to Movies</a>
				
				<div class="movie-header">
					<img src={getImageUrl(movie.poster_path)} alt={movie.title} class="poster" />
					
					<div class="movie-info">
						<h1>{movie.title}</h1>
						
						<div class="movie-meta">
							<span class="rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
							<span class="year">{new Date(movie.release_date).getFullYear() || 'N/A'}</span>
							<span class="runtime">{movie.runtime} min</span>
						</div>

						<div class="genres">
							{#each movie.genres || [] as genre}
								<span class="genre-tag">{genre.name}</span>
							{/each}
						</div>

						<p class="overview">{movie.overview || 'No overview available.'}</p>

						<div class="actions">
							<Button 
								variant={isInWatchlist ? 'secondary' : 'primary'}
								on:click={toggleWatchlist}
							>
								{isInWatchlist ? '✓ Remove from Watchlist' : '+ Add to Watchlist'}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="movie-details-content">
			<div class="detail-section">
				<h2>Details</h2>
				<div class="details-grid">
					<div class="detail-item">
						<strong>Release Date:</strong>
						<span>{new Date(movie.release_date).toLocaleDateString() || 'N/A'}</span>
					</div>
					<div class="detail-item">
						<strong>Runtime:</strong>
						<span>{movie.runtime} minutes</span>
					</div>
					<div class="detail-item">
						<strong>Rating:</strong>
						<span>{movie.vote_average?.toFixed(1) || 'N/A'}/10</span>
					</div>
					<div class="detail-item">
						<strong>Votes:</strong>
						<span>{movie.vote_count?.toLocaleString() || 'N/A'}</span>
					</div>
					{#if movie.budget}
						<div class="detail-item">
							<strong>Budget:</strong>
							<span>${movie.budget.toLocaleString()}</span>
						</div>
					{/if}
					{#if movie.revenue}
						<div class="detail-item">
							<strong>Revenue:</strong>
							<span>${movie.revenue.toLocaleString()}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.loading, .error {
		text-align: center;
		padding: 4rem 2rem;
		font-size: 1.2rem;
	}

	.error {
		color: #ff4444;
	}

	.movie-details {
		margin: -2rem;
	}

	.backdrop {
		background-size: cover;
		background-position: center;
		padding: 2rem;
		min-height: 600px;
		display: flex;
		align-items: flex-end;
	}

	.backdrop-content {
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
	}

	.back-button {
		color: white;
		text-decoration: none;
		margin-bottom: 2rem;
		display: inline-block;
		padding: 0.5rem 1rem;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 6px;
		transition: background 0.2s;
	}

	.back-button:hover {
		background: rgba(0, 0, 0, 0.7);
	}

	.movie-header {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	.poster {
		width: 300px;
		height: auto;
		border-radius: 12px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
		flex-shrink: 0;
	}

	.movie-info {
		flex: 1;
		color: white;
	}

	.movie-info h1 {
		margin: 0 0 1rem 0;
		font-size: 3rem;
	}

	.movie-meta {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.genres {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}

	.genre-tag {
		background: rgba(102, 126, 234, 0.3);
		padding: 0.5rem 1rem;
		border-radius: 20px;
		font-size: 0.9rem;
		border: 1px solid rgba(102, 126, 234, 0.5);
	}

	.overview {
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 2rem;
		color: #e0e0e0;
	}

	.actions {
		margin-top: 2rem;
	}

	.movie-details-content {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.detail-section {
		background: #1a1a1a;
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 2rem;
	}

	.detail-section h2 {
		margin: 0 0 1.5rem 0;
		color: #ffffff;
	}

	.details-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1rem;
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.detail-item strong {
		color: #b0b0b0;
		font-size: 0.9rem;
	}

	.detail-item span {
		color: #ffffff;
		font-size: 1.1rem;
	}

	@media (max-width: 768px) {
		.movie-header {
			flex-direction: column;
		}

		.poster {
			width: 100%;
			max-width: 300px;
			margin: 0 auto;
		}

		.movie-info h1 {
			font-size: 2rem;
		}

		.backdrop {
			min-height: auto;
		}
	}
</style>

