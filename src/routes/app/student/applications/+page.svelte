<script lang="ts">
	import Card from '$lib/components/common/card.svelte';
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import type { InternshipApplication } from '$lib/interfaces/internship.interface';
	import type { Student } from '$lib/interfaces/user.interface';
	import { internshipService } from '$lib/services/internship.service';
	import { appUser } from '$lib/stores/authStore';
	import { timeAgo } from '$lib/utils/helpers';
	import { onMount } from 'svelte';

	let applications: InternshipApplication[] = [];
	let isLoading = true;
	let errorMsg: string | null = null;
	let student = $appUser as Student;

	const statusColors: Record<InternshipApplication['status'], string> = {
		pending: 'bg-gray-100 text-gray-800 border-gray-300',
		viewed: 'bg-blue-100 text-blue-800 border-blue-300',
		shortlisted: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		interviewing: 'bg-purple-100 text-purple-800 border-purple-300',
		offered: 'bg-teal-100 text-teal-800 border-teal-300',
		hired: 'bg-green-100 text-green-800 border-green-300',
		rejected: 'bg-red-100 text-red-800 border-red-300'
	};

	const statusLabels: Record<InternshipApplication['status'], string> = {
		pending: 'Pendiente',
		viewed: 'Revisada',
		shortlisted: 'Preseleccionado',
		interviewing: 'En Entrevista',
		offered: 'Oferta Recibida',
		hired: 'Contratado',
		rejected: 'No Seleccionado'
	};

	onMount(async () => {
		if (student?.uid) {
			try {
				applications = await internshipService.getApplicationsByStudent(student.uid);
			} catch (e: any) {
				errorMsg = 'Error al cargar tus postulaciones: ' + e.message;
			} finally {
				isLoading = false;
			}
		} else {
			errorMsg = 'No se pudo identificar al estudiante.';
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Mis Postulaciones - PasantíasPRO</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-800">Mis Postulaciones</h1>

	{#if isLoading}
		<div class="py-20 text-center">
			<LoadingSpinner size="xl" message="Cargando tus postulaciones..." />
		</div>
	{:else if errorMsg}
		<Card>
			<p class="text-red-600">{errorMsg}</p>
		</Card>
	{:else if applications.length === 0}
		<Card class="py-10 text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mx-auto h-16 w-16 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
				/></svg
			>
			<h2 class="mt-4 text-xl font-semibold text-gray-700">Aún no tienes postulaciones.</h2>
			<p class="mt-2 text-gray-500">Explora las pasantías disponibles y ¡empieza a postular!</p>
			<a
				href="/student/internships"
				class="mt-4 inline-block rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
			>
				Buscar Pasantías
			</a>
		</Card>
	{:else}
		<div class="space-y-6">
			{#each applications as app (app.id)}
				<Card class="transition-shadow hover:shadow-md">
					<div class="flex flex-col items-start justify-between sm:flex-row">
						<div>
							<a
								href="/student/internships/{app.internshipId}"
								class="text-xl font-semibold text-indigo-700 hover:underline"
								>{app.internshipTitle}</a
							>
							<p class="mt-1 text-xs text-gray-500">Postulaste {timeAgo(app.applicationDate)}</p>
						</div>
						<div class="mt-2 sm:mt-0">
							<span
								class="inline-flex rounded-full border px-3 py-1.5 text-sm leading-5 font-semibold {statusColors[
									app.status
								]}"
							>
								{statusLabels[app.status]}
							</span>
						</div>
					</div>
					{#if app.notes}
						<div class="mt-3 rounded bg-gray-50 p-2 text-sm text-gray-700">
							<strong>Notas de la empresa:</strong>
							{app.notes}
						</div>
					{/if}
					{#if app.coverLetter}
						<details class="mt-3 text-sm">
							<summary class="cursor-pointer text-gray-600 hover:text-gray-800"
								>Ver tu carta de presentación</summary
							>
							<div
								class="mt-1 rounded border border-gray-200 bg-gray-50 p-2 whitespace-pre-line text-gray-700"
							>
								{app.coverLetter}
							</div>
						</details>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>
