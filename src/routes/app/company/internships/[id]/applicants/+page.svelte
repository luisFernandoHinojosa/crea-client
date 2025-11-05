<script lang="ts">
	import { page } from '$app/stores';
	import Alert from '$lib/components/common/alert.svelte';
	import Button from '$lib/components/common/button.svelte';
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import ApplicantList from '$lib/components/company/applicantList.svelte';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import type { Internship, InternshipApplication } from '$lib/interfaces/internship.interface';
	import { internshipService } from '$lib/services/internship.service';
	import { onMount } from 'svelte';

	let internship: Internship | undefined | null = undefined;
	let applications: InternshipApplication[] = [];
	let isLoading = true;
	let errorMsg: AlertMessage | null = null;

	onMount(async () => {
		const internshipId = $page.params.id;
		if (internshipId) {
			try {
				// Cargar la pasantía y los aplicantes en paralelo
				const [internshipData, applicationsData] = await Promise.all([
					internshipService.getInternshipById(internshipId),
					internshipService.getApplicantsForInternship(internshipId)
				]);
				internship = internshipData;
				applications = applicationsData;
				if (!internship) {
					errorMsg = { type: 'error', message: 'Pasantía no encontrada.' };
				}
			} catch (e: any) {
				errorMsg = { type: 'error', message: 'Error al cargar datos: ' + e.message };
				internship = null;
			} finally {
				isLoading = false;
			}
		} else {
			errorMsg = { type: 'error', message: 'ID de pasantía no proporcionado.' };
			isLoading = false;
			internship = null;
		}
	});
</script>

<svelte:head>
	<title
		>Postulantes para {isLoading ? '...' : internship?.title || 'Pasantía'} - PasantíasPRO</title
	>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	{#if isLoading}
		<div class="py-20 text-center">
			<LoadingSpinner size="xl" message="Cargando postulantes..." />
		</div>
	{:else if errorMsg || !internship}
		<div class="rounded-lg bg-white p-6 shadow">
			<h1 class="mb-4 text-2xl font-semibold text-red-600">Error</h1>
			{#if errorMsg}
				<Alert alert={errorMsg} on:dismiss={() => (errorMsg = null)} />
			{/if}
			<p class="mt-3 text-gray-700">
				{!internship && !errorMsg?.message ? 'No se pudo encontrar la pasantía.' : ''}
			</p>
			<div class="mt-6">
				<Button href="/company/internships">Volver a Mis Pasantías</Button>
			</div>
		</div>
	{:else}
		<div class="mb-8">
			<Button href="/company/internships" variant="outline" size="sm"
				>&larr; Volver a Mis Pasantías</Button
			>
			<h1 class="mt-3 text-3xl font-bold text-gray-800">
				Postulantes para: <span class="text-indigo-600">{internship.title}</span>
			</h1>
			<p class="text-gray-600">Total de postulantes: {applications.length}</p>
		</div>
		<ApplicantList {applications} {isLoading} internshipTitle={internship.title} />
	{/if}
</div>
