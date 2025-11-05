<script lang="ts">
	import { onMount } from 'svelte';
	import type { Internship } from '$lib/interfaces/internship.interface';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import { internshipService } from '$lib/services/internship.service';
	import Input from '$lib/components/common/input.svelte';
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import Alert from '$lib/components/common/alert.svelte';
	import InternshipCard from '$lib/components/student/internshipCard.svelte';
	import InternshipList from '$lib/components/student/internshipList.svelte';
	import Button from '$lib/components/common/button.svelte';

	let internships: Internship[] = [];
	let isLoading = true;
	let error: AlertMessage | null = null;

	let searchQuery = '';
	let locationFilter = '';
	let modalityFilter: Internship['modality'] | 'all' = 'all';
	let paidFilter: boolean | 'all' = 'all';

	async function loadInternships() {
		isLoading = true;
		error = null;
		try {
			const filters = {
				query: searchQuery || undefined,
				location: locationFilter && locationFilter !== 'all' ? locationFilter : undefined,
				modality: modalityFilter && modalityFilter !== 'all' ? modalityFilter : undefined,
				paid: typeof paidFilter === 'boolean' ? paidFilter : undefined
			};
			internships = await internshipService.getAllInternships(filters);
		} catch (e: any) {
			error = { type: 'error', message: 'Error al cargar pasantías: ' + e.message };
			internships = [];
		} finally {
			isLoading = false;
		}
	}

	onMount(loadInternships);

	function handleSearch() {
		loadInternships();
	}
</script>

<svelte:head>
	<title>Buscar Pasantías - PasantíasPRO</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-center text-3xl font-bold text-gray-800">Encuentra tu Pasantía Ideal</h1>

	<div class="mb-8 rounded-lg bg-white p-6 shadow-md">
		<form
			on:submit|preventDefault={handleSearch}
			class="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-5"
		>
			<div class="lg:col-span-2">
				<Input
					label="Buscar por palabra clave"
					bind:value={searchQuery}
					placeholder="Título, empresa, habilidad..."
				/>
			</div>
			<Input label="Ubicación" bind:value={locationFilter} placeholder="Ciudad o Remoto" />
			<div>
				<label for="modality-filter" class="mb-1 block text-sm font-medium text-gray-700"
					>Modalidad</label
				>
				<select
					id="modality-filter"
					bind:value={modalityFilter}
					class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
				>
					<option value="all">Todas</option>
					<option value="Full-time">Full-time</option>
					<option value="Part-time">Part-time</option>
					<option value="Flexible">Flexible</option>
				</select>
			</div>
			<Button type="submit" class="mt-auto h-10 w-full md:w-auto" disabled={isLoading}>
				{#if isLoading}Buscando...{:else}Buscar{/if}
			</Button>
		</form>
	</div>

	<InternshipList {internships} {isLoading} />
</div>
