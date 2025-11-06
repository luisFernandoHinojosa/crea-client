<script lang="ts">
	import type { InternshipApplication } from '$lib/interfaces/internship.interface';
	import type { Company, Student } from '$lib/interfaces/user.interface';
	import { notificationService } from '$lib/services/notification.service';
	import { appUser } from '$lib/stores/authStore';
	import { timeAgo } from '$lib/utils/helpers';
	import { createEventDispatcher } from 'svelte';
	import Card from '$lib/components/common/card.svelte';
	import Button from '$lib/components/common/button.svelte';

	export let application: InternshipApplication;
	// Opcional: Pasar el perfil del estudiante si ya se tiene para evitar otra carga
	export let studentProfile: Pick<Student, 'uid' | 'bio' | 'skills' | 'education'> | undefined =
		undefined;

	const dispatch = createEventDispatcher();
	let currentCompany = $appUser as Company;

	function viewCV() {
		if (application.cvUrl) {
			// En una app real, esto podría abrir el CV en una nueva pestaña si es una URL pública,
			// o descargarla si es una URL firmada de Firebase Storage.
			// Por ahora, solo un log o una alerta.
			// window.open(application.cvUrl, '_blank');
			alert(`Simulación: Ver CV en ${application.cvUrl}`);
		} else {
			alert('El estudiante no ha subido un CV para esta aplicación.');
		}
	}

	async function contactStudent() {
		if (currentCompany && application.studentEmail && application.studentName) {
			await notificationService.sendInterestNotificationToStudent(
				{ companyName: currentCompany.companyName },
				{ email: application.studentEmail, displayName: application.studentName }
			);
			alert(`Notificación de interés simulada enviada a ${application.studentName}.`);
		} else {
			alert('No se pudo obtener la información para contactar al estudiante.');
		}
	}

	function updateStatus(newStatus: InternshipApplication['status']) {
		dispatch('updateStatus', { applicationId: application.id, status: newStatus });
	}

	const statusColors: Record<InternshipApplication['status'], string> = {
		pending: 'bg-gray-100 text-gray-800',
		viewed: 'bg-blue-100 text-blue-800',
		shortlisted: 'bg-yellow-100 text-yellow-800',
		interviewing: 'bg-purple-100 text-purple-800',
		offered: 'bg-teal-100 text-teal-800',
		hired: 'bg-green-100 text-green-800',
		rejected: 'bg-red-100 text-red-800'
	};

	const statusLabels: Record<InternshipApplication['status'], string> = {
		pending: 'Pendiente',
		viewed: 'Visto',
		shortlisted: 'Preseleccionado',
		interviewing: 'Entrevistando',
		offered: 'Ofertado',
		hired: 'Contratado',
		rejected: 'Rechazado'
	};
</script>

<Card class="mb-4 {$$props.class || ''}">
	<div class="flex flex-col items-start justify-between sm:flex-row">
		<div>
			<h4 class="text-lg font-semibold text-indigo-700">{application.studentName}</h4>
			<p class="text-sm text-gray-500">Aplicó {timeAgo(application.applicationDate)}</p>
			{#if application.studentEmail}
				<p class="text-sm text-gray-600">Email: {application.studentEmail}</p>
			{/if}
			{#if studentProfile?.bio}
				<p class="mt-1 text-sm text-gray-600">Bio: {studentProfile.bio}</p>
			{/if}
		</div>
		<div class="mt-2 sm:mt-0">
			<span
				class="inline-flex rounded-full px-2 py-1 text-xs leading-5 font-semibold {statusColors[
					application.status
				]}"
			>
				{statusLabels[application.status]}
			</span>
		</div>
	</div>

	{#if application.coverLetter}
		<div class="mt-3 rounded-md bg-gray-50 p-3">
			<p class="text-sm font-medium text-gray-700">Carta de Presentación:</p>
			<p class="text-sm whitespace-pre-line text-gray-600">{application.coverLetter}</p>
		</div>
	{/if}

	<div class="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4">
		<Button size="sm" variant="primary" onClick={viewCV} disabled={!application.cvUrl}
			>Ver CV</Button
		>
		<Button size="sm" variant="secondary" onClick={contactStudent}>Contactar</Button>
		<div class="relative inline-block text-left">
			<select
				class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
				value={application.status}
				on:change={(e) => updateStatus(e.currentTarget.value as InternshipApplication['status'])}
			>
				<option value="pending">Pendiente</option>
				<option value="viewed">Visto</option>
				<option value="shortlisted">Preseleccionado</option>
				<option value="interviewing">Entrevistando</option>
				<option value="rejected">Rechazado</option>
				<option value="offered">Ofertado</option>
				<option value="hired">Contratado</option>
			</select>
		</div>
	</div>
</Card>
