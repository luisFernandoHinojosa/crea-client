<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { timeAgo } from '$lib/utils/helpers';
	import type { Admin, Company, Student } from '$lib/interfaces/user.interface';
	import Button from '../common/button.svelte';

	export let users: (Student | Company | Admin)[] = [];
	export let userTypeLabel: string; // 'Estudiantes' o 'Empresas'
	export let isLoading: boolean = false;

	const dispatch = createEventDispatcher();

	function handleDeleteUser(userId: string, userName?: string | null) {
		if (
			confirm(
				`¿Estás seguro de que quieres eliminar a ${userName || 'este usuario'} (${userId})? Esta acción no se puede deshacer.`
			)
		) {
			dispatch('deleteUser', userId);
		}
	}

	function handleViewProfile(userId: string) {
		// Podrías redirigir a una página de perfil de admin para ese usuario
		// o emitir un evento para abrir un modal con detalles.
		// Por ahora, un simple log.
		console.log('Ver perfil de usuario:', userId);
		alert(`Implementar vista de perfil para: ${userId}`);
	}

	// Define las columnas basado en el tipo de usuario para un ejemplo.
	// En una tabla más compleja, podrías pasar las definiciones de columna como props.
	$: isCompanyList = users.length > 0 && users[0].role === 'company';
</script>

<div class="overflow-x-auto rounded-lg bg-white shadow-md">
	<table class="min-w-full divide-y divide-gray-200">
		<thead class="bg-gray-50">
			<tr>
				<th
					scope="col"
					class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>Nombre / Empresa</th
				>
				<th
					scope="col"
					class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>Email</th
				>
				{#if isCompanyList}
					<th
						scope="col"
						class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>Sitio Web</th
					>
				{/if}
				<th
					scope="col"
					class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>Registrado</th
				>
				<th
					scope="col"
					class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
					>Acciones</th
				>
			</tr>
		</thead>
		<tbody class="divide-y divide-gray-200 bg-white">
			{#if isLoading}
				<tr>
					<td
						colspan={isCompanyList ? 5 : 4}
						class="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500"
						>Cargando {userTypeLabel.toLowerCase()}...</td
					>
				</tr>
			{:else if users.length === 0}
				<tr>
					<td
						colspan={isCompanyList ? 5 : 4}
						class="px-6 py-4 text-center text-sm whitespace-nowrap text-gray-500"
						>No hay {userTypeLabel.toLowerCase()} registrados.</td
					>
				</tr>
			{:else}
				{#each users as user (user.uid)}
					<tr>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="flex items-center">
								{#if user.photoURL}
									<div class="h-10 w-10 flex-shrink-0">
										<img
											class="h-10 w-10 rounded-full"
											src={user.photoURL}
											alt={user.displayName || user.email || 'Avatar'}
										/>
									</div>
								{:else}
									<div
										class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-500"
									>
										{user.role === 'company'
											? (user as Company).companyName?.substring(0, 1).toUpperCase()
											: user.displayName?.substring(0, 1).toUpperCase() || '?'}
									</div>
								{/if}
								<div class="ml-4">
									<div class="text-sm font-medium text-gray-900">
										{user.role === 'company' ? (user as Company).companyName : user.displayName}
									</div>
									{#if user.role === 'student' && (user as Student).bio}
										<div class="max-w-xs truncate text-xs text-gray-500">
											{(user as Student).bio}
										</div>
									{/if}
								</div>
							</div>
						</td>
						<td class="px-6 py-4 whitespace-nowrap">
							<div class="text-sm text-gray-900">{user.email}</div>
						</td>
						{#if isCompanyList}
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{#if (user as Company).website}
									<a
										href={(user as Company).website}
										target="_blank"
										rel="noopener noreferrer"
										class="text-indigo-600 hover:text-indigo-900"
									>
										{(user as Company).website}
									</a>
								{:else}
									N/A
								{/if}
							</td>
						{/if}
						<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
							{user.createdAt ? timeAgo(user.createdAt) : 'Desconocido'}
						</td>
						<td class="space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap">
							<Button size="sm" variant="outline" onClick={() => handleViewProfile(user.uid)}
								>Ver</Button
							>
							<Button
								size="sm"
								variant="danger"
								onClick={() =>
									handleDeleteUser(
										user.uid,
										user.role === 'company' ? (user as Company).companyName : user.displayName
									)}>Eliminar</Button
							>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
