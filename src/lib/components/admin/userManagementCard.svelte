<script lang="ts">
	import Button from '$lib/components/common/button.svelte';
	import Card from '$lib/components/common/card.svelte';

	export let title: string;
	export let description: string;
	export let count: number | undefined = undefined;
	export let isLoading: boolean = false;
	export let manageLink: string;
	export let manageLabel: string = 'Gestionar';
</script>

<Card class="h-full {$$props.class || ''}">
	<div slot="header">
		<h3 class="text-xl font-semibold text-indigo-700">{title}</h3>
	</div>
	<p class="mb-4 text-gray-600">{description}</p>
	{#if isLoading}
		<p class="text-2xl font-bold text-gray-500">Cargando...</p>
	{:else if count !== undefined}
		<p class="mb-4 text-4xl font-bold text-gray-800">{count}</p>
	{/if}
	<div slot="footer" class="text-right">
		<Button variant="primary" onClick={() => (window.location.href = manageLink)}
			>{manageLabel}</Button
		>
	</div>
</Card>
