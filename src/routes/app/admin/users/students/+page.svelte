<script lang="ts">
	import UserTable from '$lib/components/admin/userTable.svelte';
	import Alert from '$lib/components/common/alert.svelte';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import type { Student } from '$lib/interfaces/user.interface';
	import { userService } from '$lib/services/user.service';
	import { onMount } from 'svelte';

	let students: Student[] = [];
	let isLoading = true;
	let alertMsg: AlertMessage | null = null;

	async function loadStudents() {
		isLoading = true;
		alertMsg = null;
		try {
			students = await userService.getStudents();
		} catch (e: any) {
			alertMsg = { type: 'error', message: 'Error al cargar estudiantes: ' + e.message };
		} finally {
			isLoading = false;
		}
	}

	onMount(loadStudents);

	async function handleDelete(event: CustomEvent<string>) {
		const userId = event.detail;
		alertMsg = null;
		try {
			await userService.deleteUser(userId);
			students = students.filter((s) => s.uid !== userId);
			alertMsg = { type: 'success', message: `Estudiante ${userId} eliminado.` };
		} catch (e: any) {
			alertMsg = { type: 'error', message: `Error eliminando estudiante: ${e.message}` };
		}
	}
</script>

<svelte:head>
	<title>Gestionar Estudiantes - Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-gray-800">Gestionar Estudiantes</h1>

	{#if alertMsg}
		<Alert alert={alertMsg} on:dismiss={() => (alertMsg = null)} class="mb-6" />
	{/if}

	<UserTable
		users={students}
		userTypeLabel="Estudiantes"
		{isLoading}
		on:deleteUser={handleDelete}
	/>
</div>
