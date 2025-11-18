<script lang="ts">
	import { onMount } from 'svelte';
	import { userStore, userAccountsStore, getUserAccount, isAuthenticated } from '$lib/stores';
	import { goto } from '$app/navigation';

	let accountDetails: any = null;

	onMount(() => {
		// Get current user account details from store
		const user = $userStore;
		if (user) {
			accountDetails = getUserAccount(user.id);
		}
	});

	// Reactive statement to redirect if not authenticated
	$: if (!$isAuthenticated) {
		goto('/login');
	}
</script>

<svelte:head>
	<title>My Account - MovieHub</title>
</svelte:head>

{#if !$isAuthenticated}
	<div class="redirecting">Redirecting to login...</div>
{:else if accountDetails}
	<div class="account-page">
		<h1>My Account</h1>
		
		<div class="account-card">
			<div class="account-header">
				<h2>Account Information</h2>
			</div>
			
			<div class="account-details">
				<div class="detail-row">
					<strong>Name:</strong>
					<span>{accountDetails.name}</span>
				</div>
				
				<div class="detail-row">
					<strong>Email:</strong>
					<span>{accountDetails.email}</span>
				</div>
				
				<div class="detail-row">
					<strong>User ID:</strong>
					<span class="user-id">{accountDetails.id}</span>
				</div>
				
				{#if accountDetails.lastLogin}
					<div class="detail-row">
						<strong>Last Login:</strong>
						<span>{new Date(accountDetails.lastLogin).toLocaleString()}</span>
					</div>
				{/if}
			</div>
		</div>

		<div class="store-info">
			<h3>Store Information</h3>
			<p>This page demonstrates Svelte stores:</p>
			<ul>
				<li><strong>userStore</strong>: Current logged-in user (persisted in localStorage)</li>
				<li><strong>userAccountsStore</strong>: List of user accounts (persisted in localStorage)</li>
				<li><strong>isAuthenticated</strong>: Derived store checking authentication status</li>
			</ul>
		</div>
	</div>
{/if}

<style>
	.account-page {
		max-width: 800px;
		margin: 0 auto;
	}

	.account-page h1 {
		margin-bottom: 2rem;
		font-size: 2.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.account-card {
		background: #1a1a1a;
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.account-header h2 {
		margin: 0 0 1.5rem 0;
		color: #ffffff;
		border-bottom: 2px solid #667eea;
		padding-bottom: 0.5rem;
	}

	.account-details {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		background: #2a2a2a;
		border-radius: 8px;
	}

	.detail-row strong {
		color: #b0b0b0;
		font-weight: 500;
	}

	.detail-row span {
		color: #ffffff;
		font-size: 1.1rem;
	}

	.user-id {
		font-family: monospace;
		font-size: 0.9rem;
		color: #667eea;
	}

	.store-info {
		background: #1a1a1a;
		border-radius: 12px;
		padding: 2rem;
		color: #b0b0b0;
	}

	.store-info h3 {
		color: #ffffff;
		margin-bottom: 1rem;
	}

	.store-info ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.store-info li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	.redirecting {
		text-align: center;
		padding: 4rem 2rem;
		color: #b0b0b0;
	}
</style>

