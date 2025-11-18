<script lang="ts">
	import { signupUser } from '$lib/stores';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let error = '';
	let loading = false;

	/**
	 * Handle signup form submission
	 * Uses async/await pattern as required
	 * Uses Svelte store to manage signup and user accounts
	 */
	async function handleSignup() {
		error = '';
		
		if (!name || !email || !password || !confirmPassword) {
			error = 'Please fill in all fields';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		loading = true;

		try {
			// Use store function to signup and update stores
			const user = await signupUser(name, email, password);
			if (user) {
				goto('/movies');
			} else {
				error = 'Signup failed. Please try again.';
			}
		} catch (err: any) {
			error = err.message || 'An error occurred. Please try again.';
			console.error(err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="auth-container">
	<div class="auth-card">
		<h1>Sign Up</h1>
		<p class="subtitle">Create your MovieHub account</p>

		{#if error}
			<div class="error-message">{error}</div>
		{/if}

		<form on:submit|preventDefault={handleSignup}>
			<div class="form-group">
				<label for="name">Name</label>
				<input 
					type="text" 
					id="name" 
					bind:value={name}
					placeholder="Enter your name"
					required
					disabled={loading}
				/>
			</div>

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
					placeholder="Enter your password (min 6 characters)"
					required
					disabled={loading}
				/>
			</div>

			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<input 
					type="password" 
					id="confirmPassword" 
					bind:value={confirmPassword}
					placeholder="Confirm your password"
					required
					disabled={loading}
				/>
			</div>

			<Button type="submit" variant="primary" disabled={loading}>
				{loading ? 'Creating account...' : 'Sign Up'}
			</Button>
		</form>

		<p class="login-link">
			Already have an account? <a href="/login">Login here</a>
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

	.login-link {
		text-align: center;
		margin-top: 1.5rem;
		color: #b0b0b0;
	}

	.login-link a {
		color: #667eea;
		text-decoration: none;
	}

	.login-link a:hover {
		text-decoration: underline;
	}
</style>

