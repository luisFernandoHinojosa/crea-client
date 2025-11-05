<script lang="ts">
	import Button from '$lib/components/common/button.svelte';
	import { appUser } from '$lib/stores/authStore';

	function goHome() {
		const role = $appUser?.role;
		if (role === 'student') window.location.href = '/student/dashboard';
		else if (role === 'company') window.location.href = '/company/dashboard';
		else if (role === 'admin') window.location.href = '/admin/dashboard';
		else window.location.href = '/'; // O a /login si no hay rol
	}
</script>

<svelte:head>
	<title>Acceso Denegado - PasantíasPRO</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-15rem)] flex-col items-center justify-center px-4 text-center">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="mb-6 h-24 w-24 text-red-500"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
		stroke-width="1"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
		/>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L12 5.438 3.268 16.01c-.77 1.333.192 3 1.732 3z"
		/>
	</svg>
	<h1 class="mb-3 text-4xl font-bold text-gray-800">Acceso Denegado</h1>
	<p class="mb-8 text-lg text-gray-600">No tienes permiso para acceder a esta página o recurso.</p>
	<Button onClick={goHome} size="lg">Volver a mi Panel</Button>
	<p class="mt-4 text-sm text-gray-500">
		Si crees que esto es un error, por favor contacta al administrador.
	</p>
</div>
