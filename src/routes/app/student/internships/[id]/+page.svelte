<script lang="ts">
	import { page } from '$app/stores';
	import Alert from '$lib/components/common/alert.svelte';
	import Button from '$lib/components/common/button.svelte';
	import Card from '$lib/components/common/card.svelte';
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import Modal from '$lib/components/common/modal.svelte';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import type { Internship, InternshipApplication } from '$lib/interfaces/internship.interface';
	import type { Student } from '$lib/interfaces/user.interface';
	import { internshipService } from '$lib/services/internship.service';
	import { appUser } from '$lib/stores/authStore';
	import { timeAgo } from '$lib/utils/helpers';
	import { onMount } from 'svelte';

	let internship: Internship | undefined | null = undefined; // null para indicar que no se encontró
	let isLoading = true;
	let errorMsg: string | null = null;
	let student = $appUser as Student;

	let showApplyModal = false;
	let coverLetter = '';
	let applying = false;
	let applicationStatus: AlertMessage | null = null;
	let hasApplied = false;

	onMount(async () => {
		const internshipId = $page.params.id;
		if (internshipId) {
			try {
				internship = await internshipService.getInternshipById(internshipId);
				if (!internship) {
					errorMsg = 'Pasantía no encontrada.';
				} else {
					// Verificar si ya aplicó
					const myApplications = await internshipService.getApplicationsByStudent(student.uid);
					if (myApplications.some((app) => app.internshipId === internshipId)) {
						hasApplied = true;
					}
				}
			} catch (e: any) {
				errorMsg = 'Error al cargar la pasantía: ' + e.message;
				internship = null;
			} finally {
				isLoading = false;
			}
		} else {
			errorMsg = 'ID de pasantía no proporcionado.';
			isLoading = false;
			internship = null;
		}
	});

	async function handleApply() {
		if (!internship || !student || !student.cvUrl) {
			applicationStatus = {
				type: 'error',
				message:
					'No se puede aplicar. Asegúrate de haber subido tu CV y que los datos de la pasantía sean correctos.'
			};
			return;
		}
		applying = true;
		applicationStatus = null;

		const applicationData: Omit<InternshipApplication, 'id' | 'applicationDate' | 'status'> = {
			internshipId: internship.id,
			internshipTitle: internship.title,
			studentId: student.uid,
			studentName: student.displayName || student.email || 'Estudiante Desconocido',
			studentEmail: student.email || undefined,
			cvUrl: student.cvUrl,
			coverLetter: coverLetter.trim() || undefined
		};

		try {
			await internshipService.applyForInternship(applicationData);
			applicationStatus = { type: 'success', message: '¡Postulación enviada exitosamente!' };
			hasApplied = true;
			setTimeout(() => {
				showApplyModal = false;
			}, 2000);
		} catch (e: any) {
			applicationStatus = {
				type: 'error',
				message: 'Error al enviar la postulación: ' + (e.message || 'Inténtalo de nuevo.')
			};
		} finally {
			applying = false;
		}
	}
</script>

<svelte:head>
	<title
		>{isLoading ? 'Cargando...' : internship?.title || 'Pasantía no encontrada'} - PasantíasPRO</title
	>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	{#if isLoading}
		<div class="py-20 text-center">
			<LoadingSpinner size="xl" message="Cargando detalles de la pasantía..." />
		</div>
	{:else if errorMsg || !internship}
		<Card>
			<h2 class="mb-3 text-2xl font-semibold text-red-600">Error</h2>
			<p class="text-gray-700">
				{errorMsg || 'No se pudo encontrar la información de esta pasantía.'}
			</p>
			<div class="mt-6">
				<Button href="/student/internships">Volver a Pasantías</Button>
			</div>
		</Card>
	{:else}
		<div class="overflow-hidden rounded-lg bg-white shadow-xl">
			<div class="p-6 md:p-8">
				<div class="mb-4 flex flex-col items-start justify-between md:flex-row">
					<div>
						<h1 class="text-3xl font-bold text-gray-800 md:text-4xl">{internship.title}</h1>
						<p class="text-lg font-medium text-indigo-600">{internship.companyName}</p>
						<p class="text-sm text-gray-500">
							Publicado {timeAgo(internship.postedDate)} &bull; {internship.location}
							{#if internship.modality}
								&bull; {internship.modality}{/if}
						</p>
					</div>
					<div class="mt-4 md:mt-0">
						{#if hasApplied}
							<span
								class="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm leading-5 font-semibold text-green-800"
							>
								Ya Postulaste
							</span>
						{:else if !student.cvUrl}
							<Button variant="secondary" disabled>Sube tu CV para postular</Button>
						{:else}
							<Button size="lg" onClick={() => (showApplyModal = true)}>Postular Ahora</Button>
						{/if}
					</div>
				</div>

				{#if internship.tags && internship.tags.length > 0}
					<div class="mb-6">
						{#each internship.tags as tag}
							<span
								class="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700"
								>#{tag}</span
							>
						{/each}
					</div>
				{/if}

				<div class="prose max-w-none text-gray-700">
					<h2 class="mt-6 mb-2 text-xl font-semibold text-gray-800">Descripción de la Pasantía</h2>
					<p>{@html internship.description.replace(/\n/g, '<br>')}</p>

					{#if internship.responsibilities && internship.responsibilities.length > 0}
						<h2 class="mt-6 mb-2 text-xl font-semibold text-gray-800">Responsabilidades Clave</h2>
						<ul>
							{#each internship.responsibilities as resp}
								<li>{resp}</li>
							{/each}
						</ul>
					{/if}

					<h2 class="mt-6 mb-2 text-xl font-semibold text-gray-800">Requisitos</h2>
					<ul>
						{#each internship.requirements as req}
							<li>{req}</li>
						{/each}
					</ul>

					<h2 class="mt-6 mb-2 text-xl font-semibold text-gray-800">Detalles Adicionales</h2>
					<dl class="grid grid-cols-1 gap-x-4 gap-y-2 md:grid-cols-2">
						{#if internship.duration}
							<div>
								<dt class="font-medium">Duración:</dt>
								<dd>{internship.duration}</dd>
							</div>
						{/if}
						<div>
							<dt class="font-medium">Remuneración:</dt>
							<dd>
								{internship.paid ? internship.salaryRange || 'Sí, remunerada' : 'No remunerada'}
							</dd>
						</div>
						{#if internship.closingDate}
							<div>
								<dt class="font-medium">Cierre de postulaciones:</dt>
								<dd>{new Date(internship.closingDate).toLocaleDateString()}</dd>
							</div>
						{/if}
					</dl>
				</div>
			</div>
		</div>
	{/if}
</div>

<Modal bind:show={showApplyModal} title="Postular a {internship?.title}" size="md">
	<div slot="body" class="space-y-4">
		{#if applicationStatus}
			<Alert alert={applicationStatus} on:dismiss={() => (applicationStatus = null)} />
		{/if}
		<p class="text-sm text-gray-600">
			Estás a punto de postular a esta pasantía. Tu CV (<span class="font-medium"
				>{student?.cvFileName || 'No especificado'}</span
			>) será enviado.
		</p>
		<div>
			<label for="coverLetter" class="mb-1 block text-sm font-medium text-gray-700"
				>Carta de Presentación (Opcional)</label
			>
			<textarea
				id="coverLetter"
				bind:value={coverLetter}
				rows="4"
				class="w-full rounded-md border border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
				placeholder="Escribe un breve mensaje para la empresa..."
			></textarea>
		</div>
	</div>
	<div slot="footer" class="space-x-2">
		<Button variant="secondary" onClick={() => (showApplyModal = false)} disabled={applying}
			>Cancelar</Button
		>
		<Button
			variant="primary"
			onClick={handleApply}
			isLoading={applying}
			disabled={applying || hasApplied}
		>
			{#if applying}Enviando...{:else}Confirmar Postulación{/if}
		</Button>
	</div>
</Modal>
