<script lang="ts">
	import { page } from '$app/stores';
	import { appUser, isStudent, isCompany, isAdmin } from '$lib/stores/authStore';
	import { slide } from 'svelte/transition';

	export let isOpen: boolean = false; // Controlado desde el layout principal si es para móvil

	interface SidebarLink {
		href: string;
		label: string;
		iconPath: string; // SVG path data
		roles?: ('student' | 'company' | 'admin')[];
	}

	const commonLinks: SidebarLink[] = [
		// Puedes tener links comunes aquí si el dashboard es unificado
	];

	const studentLinks: SidebarLink[] = [
		{
			href: '/app/student/dashboard',
			label: 'Mi Panel',
			iconPath:
				'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			href: '/app/student/internships',
			label: 'Buscar Pasantías',
			iconPath: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
		},
		{
			href: '/app/student/applications',
			label: 'Mis Postulaciones',
			iconPath:
				'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
		},
		{
			href: '/app/student/profile',
			label: 'Mi Perfil',
			iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
		}
	];

	const companyLinks: SidebarLink[] = [
		{
			href: '/app/company/dashboard',
			label: 'Panel Empresa',
			iconPath:
				'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
		},
		{
			href: '/app/company/internships',
			label: 'Mis Pasantías',
			iconPath:
				'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6'
		},
		{
			href: '/app/company/internships/create',
			label: 'Publicar Nueva',
			iconPath: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z'
		},
		{
			href: '/app/company/candidates',
			label: 'Candidatos',
			iconPath: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3'
		},
		{
			href: '/app/company/profile',
			label: 'Perfil Empresa',
			iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
		}
	];

	const adminLinks: SidebarLink[] = [
		{
			href: '/app/admin/dashboard',
			label: 'Dashboard Admin',
			iconPath:
				'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2z'
		},
		{
			href: '/app/admin/users/students',
			label: 'Gestionar Estudiantes',
			iconPath:
				'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
		},
		{
			href: '/app/admin/users/companies',
			label: 'Gestionar Empresas',
			iconPath:
				'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m-6 4h6'
		}
		// Más links de admin aquí...
	];

	$: activeLinks = (() => {
		if ($isAdmin) return adminLinks;
		if ($isCompany) return companyLinks;
		if ($isStudent) return studentLinks;
		return commonLinks; // O un array vacío si no hay links comunes para el sidebar
	})();

	function closeSidebar() {
		if (window.innerWidth < 768) {
			// Asumiendo que md es 768px
			isOpen = false;
		}
	}
</script>

<aside
	class:fixed={isOpen}
	class:translate-x-0={isOpen}
	class:translate-x-full={!isOpen && typeof window !== 'undefined' && window.innerWidth < 768}
	class="absolute inset-y-0 right-0 z-30 w-64 transform
         space-y-6 bg-gray-800 px-2 py-7 text-gray-100 shadow-lg
         transition duration-200 ease-in-out md:relative md:z-auto md:translate-x-0 md:shadow-none"
	aria-label="Sidebar"
>
	{#if $appUser}
		<div class="mb-4 px-4">
			<div class="text-lg font-semibold">{$appUser.displayName || $appUser.email}</div>
			<div class="text-xs text-gray-400 uppercase">{$appUser.role}</div>
		</div>
	{/if}

	<nav>
		{#each activeLinks as link (link.href)}
			<a
				href={link.href}
				on:click={closeSidebar}
				class="flex items-center space-x-3 rounded-md px-4 py-2.5
               transition-colors duration-150 hover:bg-gray-700 hover:text-white
               {$page.url.pathname === link.href ||
				($page.url.pathname.startsWith(link.href) && link.href !== '/')
					? 'bg-gray-900 font-semibold text-white'
					: 'text-gray-300'}"
			>
				<svg
					class="h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d={link.iconPath} />
				</svg>
				<span>{link.label}</span>
			</a>
		{/each}
	</nav>
</aside>

{#if isOpen}
	<div
		class="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
		on:click={() => (isOpen = false)}
	></div>
{/if}
