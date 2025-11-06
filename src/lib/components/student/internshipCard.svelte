<script lang="ts">
	import Button from '$lib/components/common/button.svelte';
	import { goto } from '$app/navigation';
	import type { Internship } from '$lib/interfaces/internship.interface';
	import Card from '$lib/components/common/card.svelte';
	import { timeAgo } from '$lib/utils/helpers';

	export let internship: Internship;

	function viewDetails() {
		goto(`/student/internships/${internship.id}`);
	}
</script>

<Card class="flex h-full flex-col transition-shadow duration-200 hover:shadow-lg">
	<div slot="header" class="!mb-2 !pb-2">
		<h3 class="truncate text-xl font-semibold text-indigo-700" title={internship.title}>
			{internship.title}
		</h3>
		<p class="truncate text-sm text-gray-600" title={internship.companyName}>
			{internship.companyName}
		</p>
	</div>

	<div class="flex-grow space-y-2 text-sm text-gray-700">
		<p class="line-clamp-3" title={internship.description}>{internship.description}</p>
		<div class="flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mr-1 h-4 w-4 text-gray-500"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
					clip-rule="evenodd"
				/>
			</svg>
			<span>{internship.location}</span>
		</div>
		{#if internship.modality}
			<div class="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mr-1 h-4 w-4 text-gray-500"
					viewBox="0 0 20 20"
					fill="currentColor"
					><path
						d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 5v1A1 1 0 005 7h1a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1zm12 0v1a1 1 0 001 1h1a1 1 0 001-1V5a1 1 0 00-1-1h-1a1 1 0 00-1 1zM10 18a1 1 0 001-1v-1a1 1 0 00-2 0v1a1 1 0 001 1zM4 15v-1a1 1 0 00-1-1H2a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1zm12 0v-1a1 1 0 00-1-1h-1a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1zM9 6a1 1 0 011-1h4a1 1 0 110 2H10a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H10a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H10a1 1 0 01-1-1z"
					/></svg
				>
				<span>{internship.modality}</span>
			</div>
		{/if}
		{#if internship.paid}
			<p class="font-medium text-green-600">Pasantía Remunerada</p>
		{:else}
			<p class="font-medium text-orange-600">Pasantía No Remunerada</p>
		{/if}
	</div>

	<div slot="footer" class="!mt-3 flex items-center justify-between !pt-3">
		<p class="text-xs text-gray-500">Publicado {timeAgo(internship.postedDate)}</p>
		<Button size="sm" variant="primary" onClick={viewDetails}>Ver Detalles</Button>
	</div>
</Card>
