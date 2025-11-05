<script lang="ts">
	import UserTable from '$lib/components/admin/userTable.svelte';
	import Alert from '$lib/components/common/alert.svelte';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import type { Company } from '$lib/interfaces/user.interface';
	import { userService } from '$lib/services/user.service';
	import { onMount } from 'svelte';

	let companies: Company[] = [];
	let isLoading = true;
	let alertMsg: AlertMessage | null = null;

	async function loadCompanies() {
		isLoading = true;
		alertMsg = null;
		try {
			companies = await userService.getCompanies();
		} catch (e: any) {
			alertMsg = { type: 'error', message: 'Error al cargar empresas: ' + e.message };
		} finally {
			isLoading = false;
		}
	}

	onMount(loadCompanies);

	async function handleDelete(event: CustomEvent<string>) {
		const userId = event.detail;
		alertMsg = null;
		try {
			await userService.deleteUser(userId);
			companies = companies.filter((c) => c.uid !== userId);
			alertMsg = { type: 'success', message: `Empresa ${userId} eliminada.` };
		} catch (e: any) {
			alertMsg = { type: 'error', message: `Error eliminando empresa: ${e.message}` };
		}
	}
</script>

<svelte:head>
	<title>Gestionar Empresas - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-800">Gestionar Empresas</h1>

	{#if alertMsg}
		<Alert alert={alertMsg} on:dismiss={() => (alertMsg = null)} class="mb-6" />
	{/if}

	<UserTable users={companies} userTypeLabel="Empresas" {isLoading} on:deleteUser={handleDelete} />
</div>
