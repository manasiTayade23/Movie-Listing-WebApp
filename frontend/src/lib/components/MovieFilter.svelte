<script lang="ts">
	import { onMount } from 'svelte';
	import { moviesAPI } from '$lib/api/client';
	import { createEventDispatcher } from 'svelte';

	export let filters: {
		genre?: number;
		year?: number;
		rating?: number;
	} = {};

	const dispatch = createEventDispatcher();

	let genres: any[] = [];
	let years: number[] = [];
	
	// Generate years from 1970 to current year
	const currentYear = new Date().getFullYear();
	for (let year = currentYear; year >= 1970; year--) {
		years.push(year);
	}

	onMount(async () => {
		try {
			const data = await moviesAPI.getGenres();
			genres = data.genres || [];
		} catch (error) {
			console.error('Failed to load genres:', error);
		}
	});

	/**
	 * Update filters and notify parent
	 * Removes properties when set to undefined
	 */
	function updateFilters(updates: Partial<typeof filters>) {
		const newFilters = { ...filters };
		
		// Apply updates and remove properties that are undefined
		for (const key in updates) {
			if (updates[key] === undefined) {
				delete newFilters[key];
			} else {
				newFilters[key] = updates[key];
			}
		}
		
		filters = newFilters;
		dispatch('filterChange', filters);
	}

	/**
	 * Handle filter changes from select elements
	 */
	function handleGenreChange(value: string) {
		updateFilters({ genre: value === '' ? undefined : Number(value) });
	}

	function handleYearChange(value: string) {
		updateFilters({ year: value === '' ? undefined : Number(value) });
	}

	function handleRatingChange(value: string) {
		updateFilters({ rating: value === '' ? undefined : Number(value) });
	}
</script>

<div class="filters">
	<h3>Filters</h3>
	
	<div class="filter-group">
		<label for="genre">Genre:</label>
		<select id="genre" value={filters.genre ? String(filters.genre) : ''} on:change={(e) => {
			handleGenreChange(e.currentTarget.value);
		}}>
			<option value="">All Genres</option>
			{#each genres as genre}
				<option value={genre.id}>{genre.name}</option>
			{/each}
		</select>
	</div>

	<div class="filter-group">
		<label for="year">Year:</label>
		<select id="year" value={filters.year ? String(filters.year) : ''} on:change={(e) => {
			handleYearChange(e.currentTarget.value);
		}}>
			<option value="">All Years</option>
			{#each years as year}
				<option value={year}>{year}</option>
			{/each}
		</select>
	</div>

	<div class="filter-group">
		<label for="rating">Minimum Rating:</label>
		<select id="rating" value={filters.rating ? String(filters.rating) : ''} on:change={(e) => {
			handleRatingChange(e.currentTarget.value);
		}}>
			<option value="">Any Rating</option>
			<option value={7}>7+</option>
			<option value={8}>8+</option>
			<option value={9}>9+</option>
		</select>
	</div>

	<button class="clear-btn" on:click={() => {
		filters = {};
		dispatch('filterChange', filters);
	}}>Clear Filters</button>
</div>

<style>
	.filters {
		background: rgba(26, 26, 26, 0.9);
		backdrop-filter: blur(10px);
		padding: 2rem;
		border-radius: 16px;
		border: 1px solid rgba(102, 126, 234, 0.2);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 
		            0 0 0 1px rgba(102, 126, 234, 0.1);
		transition: all 0.3s ease;
	}

	.filters:hover {
		border-color: rgba(102, 126, 234, 0.4);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 
		            0 0 0 1px rgba(102, 126, 234, 0.2);
	}

	.filters h3 {
		margin: 0 0 1.5rem 0;
		color: #ffffff;
		font-size: 1.5rem;
		font-weight: 600;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		padding-bottom: 0.75rem;
		border-bottom: 2px solid rgba(102, 126, 234, 0.3);
	}

	.filter-group {
		margin-bottom: 1.5rem;
	}

	.filter-group:last-of-type {
		margin-bottom: 0;
	}

	.filter-group label {
		display: block;
		margin-bottom: 0.75rem;
		color: #e0e0e0;
		font-size: 0.95rem;
		font-weight: 500;
		letter-spacing: 0.3px;
	}

	.filter-group select {
		width: 100%;
		padding: 0.875rem 1rem;
		background: rgba(42, 42, 42, 0.8);
		border: 2px solid rgba(102, 126, 234, 0.2);
		border-radius: 10px;
		color: white;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23667eea' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		background-size: 12px;
		padding-right: 2.5rem;
	}

	.filter-group select:hover {
		border-color: rgba(102, 126, 234, 0.4);
		background-color: rgba(42, 42, 42, 0.95);
		box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
	}

	.filter-group select:focus {
		outline: none;
		border-color: #667eea;
		background-color: rgba(42, 42, 42, 1);
		box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2), 
		            0 4px 12px rgba(102, 126, 234, 0.3);
	}

	.filter-group select option {
		background: #2a2a2a;
		color: white;
		padding: 0.5rem;
	}

	.clear-btn {
		width: 100%;
		padding: 0.875rem 1.5rem;
		background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
		border: 2px solid rgba(102, 126, 234, 0.4);
		border-radius: 10px;
		color: #ffffff;
		cursor: pointer;
		font-weight: 600;
		font-size: 1rem;
		margin-top: 1.5rem;
		transition: all 0.3s ease;
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.clear-btn:hover {
		background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
		border-color: rgba(102, 126, 234, 0.6);
		box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
		transform: translateY(-2px);
	}

	.clear-btn:active {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
	}
</style>

