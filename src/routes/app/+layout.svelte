<script lang="ts">
	import { appUser, isLoadingAuth, userRole } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';
	import Sidebar from '$lib/components/layout/sidebar.svelte';

	let currentPath: string;
	$: currentPath = $page.url.pathname;

	let sidebarOpen = false; // Para controlar el sidebar en móvil desde el Navbar

	onMount(() => {
		const unsubscribeLoading = isLoadingAuth.subscribe((loading) => {
			if (!loading) {
				const unsubscribeUser = appUser.subscribe((user) => {
					if (!user) {
						if (!$page.url.pathname.startsWith('/auth')) {
							// Evitar bucle si ya está en auth
							//goto('/auth/login', { replaceState: true });
						}
						return;
					}

					// Si el usuario está logueado pero no tiene rol y no está en una página de "completar perfil"
					// Esta lógica puede ser más específica según tu flujo.
					if (!user.role && !$page.url.pathname.startsWith('/auth/complete-profile')) {
						// console.log("Usuario sin rol, redirigiendo a completar perfil o dashboard base");
						// goto('/auth/complete-profile'); // O una página genérica de dashboard
					}

					// Protección de rutas basada en rol
					const role = user.role;
					const isStudentPath = currentPath.startsWith('/student');
					const isCompanyPath = currentPath.startsWith('/company');
					const isAdminPath = currentPath.startsWith('/admin');

					if (
						(isStudentPath && role !== 'student') ||
						(isCompanyPath && role !== 'company') ||
						(isAdminPath && role !== 'admin')
					) {
						if (role) {
							// Solo redirigir si tiene un rol, pero no el correcto
							// No redirigir si estamos en una ruta pública DENTRO de (app) si existiera
							// o si está yendo a 'unauthorized'
							if (!currentPath.startsWith('/unauthorized')) {
								goto('/unauthorized', { replaceState: true });
							}
						} else if (!currentPath.startsWith('/auth/complete-profile')) {
							// Si no tiene rol Y no está yendo a completar perfil
							// goto('/auth/complete-profile');
						}
					}
				});
				// return () => unsubscribeUser(); // Descomentar para limpiar si es necesario
			}
		});
		// return () => unsubscribeLoading(); // Descomentar para limpiar si es necesario
	});

	// Cierra el sidebar si se navega
	$: $page.url.pathname,
		(() => {
			if (typeof window !== 'undefined' && window.innerWidth < 768) {
				// md breakpoint
				sidebarOpen = false;
			}
		})();
</script>

{#if $isLoadingAuth}
	<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-100">
		<LoadingSpinner size="xl" message="Verificando tu sesión..." />
	</div>
{:else if $appUser}
	<div class="flex min-h-screen flex-col bg-gray-100">
		<Navbar bind:mobileMenuOpen={sidebarOpen} />

		<div class="flex flex-1 md:overflow-hidden">
			{#if $userRole}
				<Sidebar bind:isOpen={sidebarOpen} />
			{/if}

			<main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
				{#if !$userRole && !$page.url.pathname.startsWith('/auth/complete-profile')}
					<div class="rounded-lg bg-white p-10 text-center shadow">
						<h2 class="mb-3 text-2xl font-semibold text-gray-700">Perfil Incompleto</h2>
						<p class="mb-5 text-gray-600">Parece que tu perfil o rol aún no está configurado.</p>
						<p class="mt-3 text-sm text-gray-500">
							Si crees que esto es un error, contacta a soporte.
						</p>
					</div>
				{:else}
					<slot />
				{/if}
			</main>
		</div>
	</div>
{:else}
	<div class="flex h-screen items-center justify-center text-center">
		<LoadingSpinner size="lg" message="No autenticado. Redirigiendo..." />
	</div>
{/if}
