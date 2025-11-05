<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let show: boolean = false;
	export let title: string = '';
	export let closeOnOverlayClick: boolean = true;
	export let showCloseButton: boolean = true;
	export let size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md'; // sm: max-w-sm, md: max-w-md, etc.

	const dispatch = createEventDispatcher();

	function closeModal() {
		show = false;
		dispatch('close');
	}

	function handleOverlayClick() {
		if (closeOnOverlayClick) {
			closeModal();
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && show) {
			closeModal();
		}
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		document.removeEventListener('keydown', handleKeydown);
	});

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-full h-full' // O ajusta según necesites
	};
</script>

{#if show}
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
		on:click={handleOverlayClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="w-full overflow-hidden rounded-lg bg-white shadow-xl {sizeClasses[
				size
			]} {$$props.class || ''}"
			on:click|stopPropagation
			transition:fly={{ y: -20, duration: 300 }}
		>
			{#if title || showCloseButton}
				<div class="flex items-center justify-between border-b border-gray-200 p-4">
					{#if title}
						<h2 id="modal-title" class="text-xl font-semibold text-gray-800">{title}</h2>
					{/if}
					{#if showCloseButton}
						<button
							on:click={closeModal}
							class="text-gray-400 hover:text-gray-600 focus:outline-none"
							aria-label="Cerrar modal"
						>
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					{/if}
				</div>
			{/if}

			<div class="p-6">
				<slot name="body"></slot>
			</div>

			{#if $$slots.footer}
				<div class="border-t border-gray-200 bg-gray-50 px-6 py-4 text-right">
					<slot name="footer"></slot>
				</div>
			{/if}
		</div>
	</div>
{/if}
