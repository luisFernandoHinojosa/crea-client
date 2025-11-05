<script lang="ts">
	import { onMount } from 'svelte';
	import { appUser } from '$lib/stores/authStore';
	import { userService } from '$lib/services/user.service';
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import Card from '$lib/components/common/card.svelte';

	let studentCount = 0;
	let companyCount = 0;
	let isLoading = true;

	onMount(async () => {
		try {
			studentCount = await userService.getStudentCount();
			companyCount = await userService.getCompanyCount();
		} catch (error) {
			console.error('Error cargando estadísticas del admin:', error);
			// Manejar error en UI si es necesario
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Panel de Administración - PasantíasPRO</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-800">Panel de Administración</h1>
	<p class="mb-6 text-lg text-gray-600">Bienvenido, {$appUser?.displayName || 'Admin'}.</p>

	{#if isLoading}
		<div class="mt-10 flex justify-center">
			<LoadingSpinner size="lg" message="Cargando estadísticas..." />
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			<Card padding="lg">
				<div slot="header">
					<h2 class="text-xl font-semibold text-indigo-700">Estudiantes Registrados</h2>
				</div>
				<p class="text-5xl font-bold text-gray-800">{studentCount}</p>
				<div slot="footer" class="!pt-2">
					<a href="/admin/users/students" class="text-sm text-indigo-600 hover:underline"
						>Gestionar Estudiantes</a
					>
				</div>
			</Card>

			<Card padding="lg">
				<div slot="header">
					<h2 class="text-xl font-semibold text-indigo-700">Empresas Registradas</h2>
				</div>
				<p class="text-5xl font-bold text-gray-800">{companyCount}</p>
				<div slot="footer" class="!pt-2">
					<a href="/admin/users/companies" class="text-sm text-indigo-600 hover:underline"
						>Gestionar Empresas</a
					>
				</div>
			</Card>

			<Card padding="lg">
				<div slot="header">
					<h2 class="text-xl font-semibold text-indigo-700">Pasantías Activas (Próximamente)</h2>
				</div>
				<p class="text-5xl font-bold text-gray-800">N/A</p>
				<div slot="footer" class="!pt-2">
					<span class="text-sm text-gray-500">Funcionalidad en desarrollo</span>
				</div>
			</Card>
		</div>
	{/if}
</div>
