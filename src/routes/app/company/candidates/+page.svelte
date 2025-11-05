<script lang="ts">
	import Button from '$lib/components/common/button.svelte';
	import Card from '$lib/components/common/card.svelte';
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import type { Company, Student } from '$lib/interfaces/user.interface';
	import { internshipService } from '$lib/services/internship.service';
	import { notificationService } from '$lib/services/notification.service';
	import { appUser } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	type StudentCVProfile = Pick<
		Student,
		| 'uid'
		| 'displayName'
		| 'email'
		| 'cvUrl'
		| 'cvFileName'
		| 'bio'
		| 'skills'
		| 'education'
		| 'experience'
	>;
	let studentProfiles: StudentCVProfile[] = [];
	let isLoading = true;
	let errorMsg: string | null = null;
	let currentCompany = $appUser as Company;

	onMount(async () => {
		try {
			studentProfiles = await internshipService.getPublicStudentProfilesForCompanyView();
		} catch (e: any) {
			errorMsg = 'Error al cargar perfiles de candidatos: ' + e.message;
		} finally {
			isLoading = false;
		}
	});

	async function contactStudent(student: StudentCVProfile) {
		if (currentCompany && student.email && student.displayName) {
			await notificationService.sendInterestNotificationToStudent(
				{ companyName: currentCompany.companyName },
				{ email: student.email, displayName: student.displayName }
			);
			alert(`Notificación de interés simulada enviada a ${student.displayName}.`);
		} else {
			alert('No se pudo obtener la información para contactar al estudiante.');
		}
	}
</script>

<svelte:head>
	<title>Buscar Candidatos - PasantíasPRO</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-800">Explorar Perfiles de Candidatos</h1>
	<p class="mb-6 text-gray-600">Encuentra estudiantes talentosos que han compartido su CV.</p>

	{#if isLoading}
		<div class="py-20 text-center">
			<LoadingSpinner size="xl" message="Cargando candidatos..." />
		</div>
	{:else if errorMsg}
		<Card><p class="text-red-600">{errorMsg}</p></Card>
	{:else if studentProfiles.length === 0}
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
					d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3"
				/>
			</svg>
			<h2 class="mt-4 text-xl font-semibold text-gray-700">
				No hay perfiles de candidatos disponibles por el momento.
			</h2>
			<p class="mt-2 text-gray-500">Vuelve a revisar más tarde.</p>
		</Card>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each studentProfiles as profile (profile.uid)}
				<Card class="flex flex-col">
					<div class="flex-grow">
						<h3 class="text-xl font-semibold text-indigo-700">{profile.displayName}</h3>
						{#if profile.email}<p class="text-sm text-gray-500">{profile.email}</p>{/if}
						{#if profile.bio}<p class="mt-2 line-clamp-3 text-sm text-gray-600">
								{profile.bio}
							</p>{/if}
						{#if profile.skills && profile.skills.length > 0}
							<div class="mt-3">
								<h4 class="text-xs font-medium text-gray-500 uppercase">Habilidades:</h4>
								<div class="mt-1 flex flex-wrap gap-1">
									{#each profile.skills.slice(0, 5) as skill}
										<span class="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700"
											>{skill}</span
										>
									{/each}
								</div>
							</div>
						{/if}
					</div>
					<div class="mt-4 flex gap-2 border-t border-gray-200 pt-4">
						{#if profile.cvUrl}
							<a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" class="w-full">
								<Button size="sm" variant="primary" fullWidth>Ver CV</Button>
							</a>
						{/if}
						<Button size="sm" variant="secondary" onClick={() => contactStudent(profile)} fullWidth
							>Contactar</Button
						>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
