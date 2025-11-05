<script lang="ts">
	import type { InternshipApplication } from '$lib/interfaces/internship.interface';
	import { internshipService } from '$lib/services/internship.service';
	import { notificationService } from '$lib/services/notification.service';
	import LoadingSpinner from '../common/loadingSpinner.svelte';
	import ApplicantCard from './applicantCard.svelte';

	export let applications: InternshipApplication[] = [];
	export let isLoading: boolean = false;
	export let internshipTitle: string = '';

	async function handleUpdateStatus(
		event: CustomEvent<{ applicationId: string; status: InternshipApplication['status'] }>
	) {
		const { applicationId, status } = event.detail;
		const appIndex = applications.findIndex((app) => app.id === applicationId);
		if (appIndex !== -1) {
			try {
				const updatedApp = await internshipService.updateApplicationStatus(applicationId, status);
				if (updatedApp) {
					applications[appIndex] = updatedApp;
					applications = [...applications]; // Trigger reactivity
					if (updatedApp.studentEmail) {
						await notificationService.notifyStudentApplicationUpdate(
							updatedApp.studentEmail,
							internshipTitle,
							status
						);
					}
					console.log(`Estado de aplicación ${applicationId} actualizado a ${status}`);
				}
			} catch (e) {
				console.error('Error actualizando estado de aplicación:', e);
				alert('No se pudo actualizar el estado de la aplicación.');
			}
		}
	}
</script>

{#if isLoading}
	<div class="py-10">
		<LoadingSpinner message="Cargando postulantes..." />
	</div>
{:else if applications.length === 0}
	<div class="rounded-lg bg-white p-6 py-10 text-center shadow">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="mx-auto h-12 w-12 text-gray-400"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="1"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
			/>
		</svg>
		<h3 class="mt-2 text-sm font-medium text-gray-900">No hay postulantes</h3>
		<p class="mt-1 text-sm text-gray-500">Aún no hay postulaciones para esta pasantía.</p>
	</div>
{:else}
	<div class="space-y-6">
		{#each applications as app (app.id)}
			<ApplicantCard application={app} on:updateStatus={handleUpdateStatus} />
		{/each}
	</div>
{/if}
