<script lang="ts">
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import StudentProfileForm from '$lib/components/student/studentProfileForm.svelte';
	import type { Student } from '$lib/interfaces/user.interface';
	import { appUser, isLoadingAuth } from '$lib/stores/authStore';

	let student: Student | null = null;

	// Svelte store subscriptions
	$: student = $appUser?.role === 'student' ? ($appUser as Student) : null;
	$: isLoading = $isLoadingAuth;

	function handleProfileUpdated() {
		// El store appUser ya se actualiza dentro del servicio authService.updateUserProfile
		// Podrías mostrar un toast o un mensaje de éxito aquí si lo deseas.
		console.log('Perfil de estudiante actualizado (detectado en la página padre).');
	}
</script>

<svelte:head>
	<title>Mi Perfil - PasantíasPRO</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	{#if isLoading || !student}
		<div class="py-20 text-center">
			<LoadingSpinner size="xl" message="Cargando tu perfil..." />
		</div>
	{:else}
		<StudentProfileForm {student} on:profileUpdated={handleProfileUpdated} />
	{/if}
</div>
