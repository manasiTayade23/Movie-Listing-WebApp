<script lang="ts">
	/**
	 * Reusable Button component demonstrating Svelte slots
	 */
	export let variant: 'primary' | 'secondary' = 'primary';
	export let type: 'button' | 'submit' = 'button';
	export let disabled: boolean = false;
</script>

<button class="btn" class:primary={variant === 'primary'} class:secondary={variant === 'secondary'} {type} {disabled}>
	<slot />
</button>

<style>
	.btn {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 6px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1rem;
	}

	.btn.primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.btn.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}

	.btn.secondary {
		background: #2a2a2a;
		color: white;
		border: 1px solid #333;
	}

	.btn.secondary:hover {
		background: #3a3a3a;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.btn:disabled:hover {
		transform: none;
		box-shadow: none;
	}
</style>

