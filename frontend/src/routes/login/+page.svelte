<script lang="ts">
	import { loginUser } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';

	let email = '';
	let password = '';
	let error = '';
	let loading = false;

	/**
	 * Handle login form submission
	 * Uses async/await pattern as required
	 * Uses Svelte store to manage login state
	 */
	async function handleLogin() {
		error = '';
		
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;

		try {
			// Use store function to login and update stores
			const user = await loginUser(email, password);
			if (user) {
				goto('/movies');
			} else {
				error = 'Login failed. Please try again.';
			}
		} catch (err: any) {
			console.error('Login error:', err);
			error = err.message || 'Invalid email or password. Please check your credentials.';
		} finally {
			loading = false;
		}
	}
</script>

<div class="auth-container">
	<div class="auth-card">
		<h1>Login</h1>
		<p class="subtitle">Welcome back to MovieHub</p>

		{#if error}
			<div class="error-message">{error}</div>
		{/if}

		<form on:submit|preventDefault={handleLogin}>
			<div class="form-group">
				<label for="email">Email</label>
				<input 
					type="email" 
					id="email" 
					bind:value={email}
					placeholder="Enter your email"
					required
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input 
					type="password" 
					id="password" 
					bind:value={password}
					placeholder="Enter your password"
					required
					disabled={loading}
				/>
			</div>

			<Button type="submit" variant="primary" disabled={loading}>
				{loading ? 'Logging in...' : 'Login'}
			</Button>
		</form>

		<p class="signup-link">
			Don't have an account? <a href="/signup">Sign up here</a>
		</p>
	</div>
</div>

<style>
	.auth-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 200px);
		padding: 2rem;
	}

	.auth-card {
		background: #1a1a1a;
		padding: 2rem;
		border-radius: 12px;
		width: 100%;
		max-width: 400px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
	}

	.auth-card h1 {
		margin: 0 0 0.5rem 0;
		text-align: center;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		text-align: center;
		color: #b0b0b0;
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		color: #ffffff;
		font-weight: 500;
	}

	.form-group input {
		width: 100%;
		padding: 0.75rem;
		background: #2a2a2a;
		border: 1px solid #333;
		border-radius: 6px;
		color: white;
		font-size: 1rem;
		box-sizing: border-box;
	}

	.form-group input:focus {
		outline: none;
		border-color: #667eea;
	}

	.form-group input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-message {
		background: #ff4444;
		color: white;
		padding: 0.75rem;
		border-radius: 6px;
		margin-bottom: 1rem;
		text-align: center;
	}

	.signup-link {
		text-align: center;
		margin-top: 1.5rem;
		color: #b0b0b0;
	}

	.signup-link a {
		color: #667eea;
		text-decoration: none;
	}

	.signup-link a:hover {
		text-decoration: underline;
	}
</style>

