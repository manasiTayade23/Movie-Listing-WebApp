<script lang="ts">
	import { getImageUrl } from '$lib/api/utils';
	import { watchlistStore, userStore } from '$lib/stores';
	import { watchlistAPI } from '$lib/api/client';
	import { goto } from '$app/navigation';

	export let movie: any;

	/**
	 * Toggle movie in watchlist
	 */
	async function toggleWatchlist(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		
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
	$: isInWatchlist = $watchlistStore.includes(movie.id);
</script>

<div class="movie-card">
	<a href="/movies/{movie.id}" class="movie-link">
		<img src={getImageUrl(movie.poster_path)} alt={movie.title} loading="lazy" />
		<div class="movie-info">
			<h3>{movie.title}</h3>
			<div class="movie-meta">
				<span class="rating">⭐ {movie.vote_average?.toFixed(1) || 'N/A'}</span>
				<span class="year">{new Date(movie.release_date).getFullYear() || 'N/A'}</span>
			</div>
		</div>
	</a>
	
	<button 
		class="watchlist-btn" 
		class:active={isInWatchlist}
		on:click={toggleWatchlist}
	>
		{isInWatchlist ? '✓ Remove from Watchlist' : '+ Add to Watchlist'}
	</button>
</div>

<style>
	.movie-card {
		background: #1a1a1a;
		border-radius: 12px;
		overflow: visible;
		transition: transform 0.2s, box-shadow 0.2s;
		position: relative;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.movie-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
		z-index: 100;
	}

	.movie-link {
		text-decoration: none;
		color: inherit;
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.movie-card img {
		width: 100%;
		height: 400px;
		object-fit: cover;
		display: block;
		flex-shrink: 0;
	}

	.movie-info {
		padding: 1rem;
		flex-shrink: 0;
	}

	.movie-info h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		color: #ffffff;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.movie-meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.9rem;
		color: #b0b0b0;
	}

	.watchlist-btn {
		width: 100%;
		padding: 0.75rem;
		background: #2a2a2a;
		border: none;
		color: white;
		cursor: pointer;
		font-weight: 500;
		transition: background 0.2s;
		border-top: 1px solid #333;
		flex-shrink: 0;
	}

	.watchlist-btn:hover {
		background: #3a3a3a;
	}

	.watchlist-btn.active {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}
</style>

