<script lang="ts">
	import { appUser, isLoadingAuth } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores'; // Para evitar redirecciones en bucle
	import Navbar from '$lib/components/layout/navbar.svelte';
	import Footer from '$lib/components/layout/footer.svelte';

	onMount(() => {
		// Si el usuario ya está logueado y no está en una ruta específica de "completar perfil",
		// redirigirlo a su dashboard correspondiente.
		const unsubscribeAuth = isLoadingAuth.subscribe((loading) => {
			if (!loading) {
				const unsubscribeUser = appUser.subscribe((user) => {
					if (user && user.role) {
						// Si hay usuario y tiene rol
						if ($page.url.pathname.startsWith('/auth/complete-profile')) {
							// No redirigir si está en completar perfil
							return;
						}
						if (user.role === 'student') goto('/app/student/internships', { replaceState: true });
						else if (user.role === 'company')
							goto('/app/company/dashboard', { replaceState: true });
						else if (user.role === 'admin') goto('/app/admin/dashboard', { replaceState: true });
					}
				});
				// return () => unsubscribeUser(); // Descomentar si es necesario para evitar memory leaks
			}
		});
		// return () => unsubscribeAuth(); // Descomentar si es necesario
	});
</script>

<div class="flex min-h-screen flex-col">
	<Navbar />
	<main class="container mx-auto flex-grow px-4 py-8">
		<slot />
	</main>
	<Footer />
</div>
