<script lang="ts">
	import { page } from '$app/stores';
	import { userRole, appUser } from '$lib/stores/authStore';
	import { slide } from 'svelte/transition';
	import Button from '../common/button.svelte';
	import { signOut } from '$lib/services/auth.service';

	export let mobileMenuOpen = false;

	interface NavLink {
		href: string;
		label: string;
		roles?: ('student' | 'company' | 'admin')[]; // Roles que pueden ver este enlace
		authRequired?: boolean; // true si requiere autenticación, false para público, undefined para ambos
	}

	let baseNavLinks: NavLink[] = [
		{ href: '/', label: 'Inicio' },
		{
			href: '/app/student/internships',
			label: 'Buscar Pasantías',
			roles: ['student'],
			authRequired: true
		},
		{
			href: '/app/company/internships/create',
			label: 'Publicar Pasantía',
			roles: ['company'],
			authRequired: true
		}
	];

	let studentNavLinks: NavLink[] = [
		{
			href: '/app/student/dashboard',
			label: 'Mi Panel (Est.)',
			roles: ['student'],
			authRequired: true
		},
		{
			href: '/app/student/applications',
			label: 'Mis Postulaciones',
			roles: ['student'],
			authRequired: true
		},
		{
			href: '/app/student/profile',
			label: 'Mi Perfil (Est.)',
			roles: ['student'],
			authRequired: true
		}
	];

	let companyNavLinks: NavLink[] = [
		{
			href: '/app/company/dashboard',
			label: 'Panel Empresa',
			roles: ['company'],
			authRequired: true
		},
		{
			href: '/app/company/internships',
			label: 'Mis Pasantías',
			roles: ['company'],
			authRequired: true
		},
		{
			href: '/app/company/candidates',
			label: 'Candidatos',
			roles: ['company'],
			authRequired: true
		},
		{
			href: '/app/company/profile',
			label: 'Perfil Empresa',
			roles: ['company'],
			authRequired: true
		}
	];

	let adminNavLinks: NavLink[] = [
		{ href: '/app/admin/dashboard', label: 'Panel Admin', roles: ['admin'], authRequired: true },
		{
			href: '/app/admin/users/students',
			label: 'Estudiantes (Admin)',
			roles: ['admin'],
			authRequired: true
		},
		{
			href: '/app/admin/users/companies',
			label: 'Empresas (Admin)',
			roles: ['admin'],
			authRequired: true
		}
	];

	$: currentRole = userRole;
	$: currentUser = appUser;

	$: visibleNavLinks = (() => {
		let linksToShow: NavLink[] = [
			...baseNavLinks.filter(
				(link) =>
					link.authRequired === undefined ||
					(link.authRequired && currentUser) ||
					(!link.authRequired && !currentUser)
			)
		];

		if (currentUser) {
			// if ($currentRole === 'student') linksToShow = linksToShow.concat(studentNavLinks);
			// if ($currentRole === 'company') linksToShow = linksToShow.concat(companyNavLinks);
			// if ($currentRole === 'admin') linksToShow = linksToShow.concat(adminNavLinks);

			// Filtrar por rol específico si está definido en el link
			linksToShow = linksToShow.filter(
				(link) => !link.roles || (link.roles && $currentRole && link.roles.includes($currentRole))
			);
		} else {
			// Para usuarios no autenticados, solo mostrar los que no requieren auth o no especifican
			linksToShow = baseNavLinks.filter((link) => !link.authRequired);
		}
		// Eliminar duplicados por href
		return linksToShow.filter(
			(link, index, self) => index === self.findIndex((l) => l.href === link.href)
		);
	})();

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<nav class="sticky top-0 z-40 bg-white shadow-md">
	<div class="container mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center">
				<a href="/" class="flex-shrink-0">
					<span class="text-xl font-bold text-indigo-600">CREA</span>
				</a>
			</div>

			<div class="hidden md:flex md:items-center md:space-x-4">
				{#each visibleNavLinks as link (link.href)}
					<a
						href={link.href}
						class="rounded-md px-3 py-2 text-sm font-medium
                   {$page.url.pathname === link.href
							? 'bg-indigo-100 text-indigo-700'
							: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}"
						aria-current={$page.url.pathname === link.href ? 'page' : undefined}
					>
						{link.label}
					</a>
				{/each}

				{#if $currentUser}
					<Button variant="outline" size="sm" onClick={signOut}>Cerrar Sesión</Button>
					<span class="ml-2 hidden text-sm text-gray-500 lg:block"
						>{$currentUser?.displayName || $currentUser?.email}</span
					>
				{:else}
					<Button
						variant="primary"
						size="sm"
						onClick={() =>
							$page.url.pathname !== '/auth/login' && (window.location.href = '/auth/login')}
						>Iniciar Sesión</Button
					>
					<Button
						variant="secondary"
						size="sm"
						onClick={() =>
							$page.url.pathname !== '/auth/register' && (window.location.href = '/auth/register')}
						>Registrarse</Button
					>
				{/if}
			</div>

			<div class="flex items-center md:hidden">
				<button
					on:click={toggleMobileMenu}
					type="button"
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:ring-inset"
					aria-controls="mobile-menu"
					aria-expanded={mobileMenuOpen}
				>
					<span class="sr-only">Abrir menú principal</span>
					{#if !mobileMenuOpen}
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/></svg
						>
					{:else}
						<svg
							class="block h-6 w-6"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/></svg
						>
					{/if}
				</button>
			</div>
		</div>
	</div>

	{#if mobileMenuOpen}
		<div
			class="fixed inset-x-0 top-16 z-30 border-t border-gray-200 bg-white p-4 shadow-lg md:hidden"
			id="mobile-menu"
			transition:slide={{ duration: 200 }}
		>
			<div class="space-y-1">
				{#each visibleNavLinks as link (link.href)}
					<a
						href={link.href}
						on:click={() => (mobileMenuOpen = false)}
						class="block rounded-md px-3 py-2 text-base font-medium
                   {$page.url.pathname === link.href
							? 'bg-indigo-50 text-indigo-700'
							: 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}"
						aria-current={$page.url.pathname === link.href ? 'page' : undefined}
					>
						{link.label}
					</a>
				{/each}
			</div>
			<div class="mt-6 border-t border-gray-200 pt-4">
				{#if $currentUser}
					<div class="flex items-center px-3">
						<div class="ml-3">
							<div class="text-base font-medium text-gray-800">
								{$currentUser.displayName || 'Usuario'}
							</div>
							<div class="text-sm font-medium text-gray-500">{$currentUser.email}</div>
						</div>
					</div>
					<div class="mt-3 space-y-1">
						<Button
							variant="outline"
							fullWidth
							onClick={() => {
								signOut();
								mobileMenuOpen = false;
							}}>Cerrar Sesión</Button
						>
					</div>
				{:else}
					<div class="space-y-2">
						<Button
							variant="primary"
							fullWidth
							onClick={() => {
								$page.url.pathname !== '/auth/login' && (window.location.href = '/auth/login');
								mobileMenuOpen = false;
							}}>Iniciar Sesión</Button
						>
						<Button
							variant="secondary"
							fullWidth
							onClick={() => {
								$page.url.pathname !== '/auth/register' &&
									(window.location.href = '/auth/register');
								mobileMenuOpen = false;
							}}>Registrarse</Button
						>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</nav>
