<script lang="ts">
	import Card from '../common/card.svelte';
	import LoadingSpinner from '../common/loadingSpinner.svelte';

	export let title: string;
	export let value: string | number | undefined = undefined;
	export let isLoading: boolean = false;
	export let iconPath: string | undefined = undefined; // SVG path data for an icon
	export let link: { href: string; label: string } | undefined = undefined;
	export let unit: string = '';
</script>

<Card class="h-full {$$props.class || ''}" padding="md">
	<div class="mb-1 flex items-center justify-between">
		<h3 class="truncate text-base font-medium text-gray-500">{title}</h3>
		{#if iconPath}
			<div class="rounded-full bg-indigo-100 p-2">
				<svg
					class="h-5 w-5 text-indigo-600"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path fill-rule="evenodd" d={iconPath} clip-rule="evenodd" />
				</svg>
			</div>
		{/if}
	</div>
	{#if isLoading}
		<div class="py-4">
			<LoadingSpinner size="sm" />
		</div>
	{:else if value !== undefined}
		<p class="text-3xl font-semibold text-gray-800">
			{value} <span class="text-xl font-medium text-gray-600">{unit}</span>
		</p>
	{:else}
		<p class="text-3xl font-semibold text-gray-400">-</p>
	{/if}
	{#if link && !isLoading}
		<div class="mt-3">
			<a href={link.href} class="text-sm font-medium text-indigo-600 hover:text-indigo-800">
				{link.label} &rarr;
			</a>
		</div>
	{/if}
</Card>
