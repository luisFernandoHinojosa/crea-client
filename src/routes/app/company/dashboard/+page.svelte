<script lang="ts">
	import Button from '$lib/components/common/button.svelte';
	import Card from '$lib/components/common/card.svelte';
	import type { Company } from '$lib/interfaces/user.interface';
	import { internshipService } from '$lib/services/internship.service';
	import { appUser } from '$lib/stores/authStore';
	import { onMount } from 'svelte';

	let company = $appUser as Company;
	let postedInternshipsCount = 0;
	let totalApplicantsCount = 0; // Suma de todos los aplicantes
	let isLoadingStats = true;

	onMount(async () => {
		if (company?.uid) {
			try {
				const internships = await internshipService.getInternshipsByCompany(company.uid);
				postedInternshipsCount = internships.length;
				totalApplicantsCount = internships.reduce(
					(sum, intern) => sum + (intern.applicationsCount || 0),
					0
				);
			} catch (e) {
				console.error('Error cargando estadísticas de empresa:', e);
			} finally {
				isLoadingStats = false;
			}
		} else {
			isLoadingStats = false;
		}
	});
</script>

<svelte:head>
	<title>Panel de Empresa - {company?.companyName}</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-2 text-3xl font-bold text-gray-800">Panel de {company?.companyName}</h1>
	<p class="mb-8 text-lg text-gray-600">Gestiona tus pasantías y encuentra el mejor talento.</p>

	<div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<Card>
			<h3 class="text-lg font-medium text-gray-500">Pasantías Publicadas</h3>
			{#if isLoadingStats}
				<p class="text-3xl font-semibold text-gray-400">...</p>
			{:else}
				<p class="text-3xl font-semibold text-gray-800">{postedInternshipsCount}</p>
			{/if}
		</Card>
		<Card>
			<h3 class="text-lg font-medium text-gray-500">Total de Postulantes</h3>
			{#if isLoadingStats}
				<p class="text-3xl font-semibold text-gray-400">...</p>
			{:else}
				<p class="text-3xl font-semibold text-gray-800">{totalApplicantsCount}</p>
			{/if}
		</Card>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<Card>
			<h2 class="mb-3 text-xl font-semibold text-indigo-700">Gestionar Pasantías</h2>
			<p class="mb-4 text-gray-600">Revisa, edita o elimina tus ofertas de pasantías publicadas.</p>
			<Button href="/company/internships">Mis Pasantías</Button>
		</Card>
		<Card>
			<h2 class="mb-3 text-xl font-semibold text-indigo-700">Publicar Nueva Pasantía</h2>
			<p class="mb-4 text-gray-600">
				Atrae a nuevos talentos creando una nueva oferta de pasantía.
			</p>
			<Button href="/company/internships/create" variant="primary">Publicar Nueva</Button>
		</Card>
		<Card>
			<h2 class="mb-3 text-xl font-semibold text-indigo-700">Buscar Candidatos</h2>
			<p class="mb-4 text-gray-600">Explora perfiles de estudiantes que han compartido su CV.</p>
			<Button href="/company/candidates">Ver Candidatos</Button>
		</Card>
		<Card>
			<h2 class="mb-3 text-xl font-semibold text-indigo-700">Perfil de Empresa</h2>
			<p class="mb-4 text-gray-600">Mantén actualizada la información de tu empresa.</p>
			<Button href="/company/profile" variant="secondary">Editar Perfil</Button>
		</Card>
	</div>
</div>
