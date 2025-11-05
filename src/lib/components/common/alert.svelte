<script lang="ts">
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';

	export let alert: AlertMessage; // Pasar el objeto de alerta completo
	export let dismissible: boolean = true;

	const dispatch = createEventDispatcher();

	let visible = true;
	let timer: any;

	const alertStyles = {
		success: {
			bg: 'bg-green-50',
			border: 'border-green-400',
			iconColor: 'text-green-400',
			textColor: 'text-green-700',
			iconPath:
				'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' // Check circle
		},
		error: {
			bg: 'bg-red-50',
			border: 'border-red-400',
			iconColor: 'text-red-400',
			textColor: 'text-red-700',
			iconPath:
				'M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM10 4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z' // Exclamation circle (ajustar path si es necesario)
		},
		warning: {
			bg: 'bg-yellow-50',
			border: 'border-yellow-400',
			iconColor: 'text-yellow-400',
			textColor: 'text-yellow-700',
			iconPath:
				'M12 2L1 21h22L12 2zm0 14a1 1 0 100 2 1 1 0 000-2zm0-6a1 1 0 00-1 1v3a1 1 0 102 0V9a1 1 0 00-1-1z' // Warning triangle
		},
		info: {
			bg: 'bg-blue-50',
			border: 'border-blue-400',
			iconColor: 'text-blue-400',
			textColor: 'text-blue-700',
			iconPath:
				'M13 16h-1v-4h1m0-4h-1v-2h1m-1 12a1 1 0 100 2 1 1 0 000-2zM10 18a8 8 0 100-16 8 8 0 000 16z' // Info circle
		}
	};

	const currentStyle = alertStyles[alert.type];

	function dismiss() {
		visible = false;
		dispatch('dismiss', alert.id || alert.message);
		if (timer) clearTimeout(timer);
	}

	onMount(() => {
		if (alert.duration && alert.duration > 0) {
			timer = setTimeout(dismiss, alert.duration);
		}
	});

	onDestroy(() => {
		if (timer) clearTimeout(timer);
	});
</script>

{#if visible}
	<div
		class="rounded-md {currentStyle.bg} border-l-4 p-4 {currentStyle.border} {$$props.class || ''}"
		role="alert"
	>
		<div class="flex">
			<div class="flex-shrink-0">
				<svg
					class="h-5 w-5 {currentStyle.iconColor}"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path fill-rule="evenodd" d={currentStyle.iconPath} clip-rule="evenodd" />
				</svg>
			</div>
			<div class="ml-3">
				<p class="text-sm {currentStyle.textColor}">
					{@html alert.message}
				</p>
			</div>
			{#if dismissible}
				<div class="ml-auto pl-3">
					<div class="-mx-1.5 -my-1.5">
						<button
							type="button"
							on:click={dismiss}
							class="inline-flex {currentStyle.bg} rounded-md p-1.5 {currentStyle.textColor} hover:bg-opacity-75 focus:ring-2 focus:ring-offset-2 focus:outline-none focus:ring-offset-{alert.type}-50 focus:ring-{alert.type}-600"
						>
							<span class="sr-only">Dismiss</span>
							<svg
								class="h-5 w-5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
