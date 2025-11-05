<script lang="ts">
	import Alert from '$lib/components/common/alert.svelte';
	import Button from '$lib/components/common/button.svelte';
	import Card from '$lib/components/common/card.svelte';
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import type { Internship } from '$lib/interfaces/internship.interface';
	import type { Company } from '$lib/interfaces/user.interface';
	import { internshipService } from '$lib/services/internship.service';
	import { appUser } from '$lib/stores/authStore';
	import { timeAgo } from '$lib/utils/helpers';
	import { onMount } from 'svelte';

	let internships: Internship[] = [];
	let isLoading = true;
	let errorMsg: AlertMessage | null = null;
	let company = $appUser as Company;

	async function loadInternships() {
		isLoading = true;
		errorMsg = null;
		if (company?.uid) {
			try {
				internships = await internshipService.getInternshipsByCompany(company.uid);
			} catch (e: any) {
				errorMsg = { type: 'error', message: 'Error al cargar tus pasantías: ' + e.message };
			} finally {
				isLoading = false;
			}
		} else {
			errorMsg = { type: 'error', message: 'No se pudo identificar la empresa.' };
			isLoading = false;
		}
	}

	onMount(loadInternships);

	async function deleteInternship(internshipId: string, internshipTitle: string) {
		if (
			confirm(
				`¿Estás seguro de que quieres eliminar la pasantía "${internshipTitle}"? Esta acción no se puede deshacer y eliminará todas sus postulaciones.`
			)
		) {
			try {
				await internshipService.deleteInternship(internshipId, company.uid);
				internships = internships.filter((i) => i.id !== internshipId);
				errorMsg = { type: 'success', message: `Pasantía "${internshipTitle}" eliminada.` };
			} catch (e: any) {
				errorMsg = { type: 'error', message: `Error eliminando pasantía: ${e.message}` };
			}
		}
	}
</script>

<svelte:head>
	<title>Mis Pasantías - {company?.companyName}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<h1 class="text-3xl font-bold text-gray-800">Mis Pasantías Publicadas</h1>
		<Button href="/company/internships/create" variant="primary">Publicar Nueva Pasantía</Button>
	</div>

	{#if errorMsg}
		<Alert alert={errorMsg} on:dismiss={() => (errorMsg = null)} class="mb-6" />
	{/if}

	{#if isLoading}
		<div class="py-20 text-center">
			<LoadingSpinner size="xl" message="Cargando tus pasantías..." />
		</div>
	{:else if internships.length === 0}
		<Card class="py-10 text-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="mx-auto h-16 w-16 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
				/>
			</svg>
			<h2 class="mt-4 text-xl font-semibold text-gray-700">Aún no has publicado pasantías.</h2>
			<p class="mt-2 text-gray-500">¡Crea tu primera oferta para atraer talento!</p>
		</Card>
	{:else}
		<div class="space-y-6">
			{#each internships as item (item.id)}
				<Card>
					<div class="flex flex-col justify-between md:flex-row">
						<div>
							<h2 class="text-xl font-semibold text-indigo-700">{item.title}</h2>
							<p class="text-sm text-gray-500">
								Estado: <span
									class:text-green-600={item.status === 'open'}
									class:text-red-600={item.status !== 'open'}>{item.status.toUpperCase()}</span
								>
								&bull; Publicado {timeAgo(item.postedDate)}
							</p>
							<p class="mt-1 text-sm text-gray-600">Postulantes: {item.applicationsCount || 0}</p>
						</div>
						<div class="mt-3 flex flex-wrap items-start gap-2 md:mt-0">
							<Button size="sm" onClick={() => goto(`/company/internships/${item.id}/applicants`)}
								>Ver Postulantes</Button
							>
							<Button
								size="sm"
								variant="danger"
								onClick={() => deleteInternship(item.id, item.title)}>Eliminar</Button
							>
						</div>
					</div>
					{#if item.description}
						<p class="mt-3 line-clamp-2 text-sm text-gray-700">{item.description}</p>
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</div>
