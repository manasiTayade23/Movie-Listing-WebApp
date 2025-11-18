<script lang="ts">
	import { userStore } from '$lib/stores';
</script>

<div class="welcome">
	<h1>Welcome to MovieHub</h1>
	<p>Discover and manage your favorite movies</p>
	
	{#if $userStore}
		<div class="user-greeting">
			<p>Hello, {$userStore.email}!</p>
			<div class="action-buttons">
				<a href="/movies" class="cta-button">Browse Movies</a>
				<a href="/watchlist" class="cta-button secondary">My Watchlist</a>
			</div>
		</div>
	{:else}
		<div class="auth-prompt">
			<p>Please sign in or create an account to get started</p>
			<div class="action-buttons">
				<a href="/login" class="cta-button">Login</a>
				<a href="/signup" class="cta-button secondary">Sign Up</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.welcome {
		text-align: center;
		padding: 4rem 2rem;
	}

	.welcome h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.welcome p {
		font-size: 1.2rem;
		color: #b0b0b0;
		margin-bottom: 2rem;
	}

	.user-greeting, .auth-prompt {
		margin-top: 2rem;
	}

	.user-greeting p, .auth-prompt p {
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
	}

	.action-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.cta-button {
		display: inline-block;
		padding: 1rem 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		text-decoration: none;
		border-radius: 8px;
		font-weight: 600;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.cta-button:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
	}

	.cta-button.secondary {
		background: #2a2a2a;
		border: 2px solid #667eea;
	}

	.cta-button.secondary:hover {
		background: #3a3a3a;
		box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
	}
</style>

