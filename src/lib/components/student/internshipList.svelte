<script lang="ts">
	import type { Internship } from '$lib/interfaces/internship.interface';
	import LoadingSpinner from '../common/loadingSpinner.svelte';
	import InternshipCard from './internshipCard.svelte';

	export let internships: Internship[] = [];
	export let isLoading: boolean = false;
	export let noResultsMessage: string = 'No se encontraron pasantías con los criterios actuales.';
</script>

{#if isLoading}
	<div class="flex items-center justify-center py-10">
		<LoadingSpinner message="Cargando pasantías..." size="lg" />
	</div>
{:else if internships.length === 0}
	<div class="py-10 text-center">
		<p class="text-xl text-gray-600">{noResultsMessage}</p>
	</div>
{:else}
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each internships as internship (internship.id)}
			<InternshipCard {internship} />
		{/each}
	</div>
{/if}
