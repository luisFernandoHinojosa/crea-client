<script lang="ts">
	import { registerUser, type RegistrationDetails } from '$lib/services/auth.service';
	import { goto } from '$app/navigation';
	import { userRole, appUser, setSimulatedRoleInLocalStorage } from '$lib/stores/authStore';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import type { Role } from '$lib/types/user';
	import Alert from '../common/alert.svelte';
	import Input from '../common/input.svelte';
	import Button from '../common/Button.svelte';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let displayName = ''; // Para estudiantes y admins
	let companyName = ''; // Para empresas
	let selectedRole: Role = 'student';

	let alert: AlertMessage | null = null;
	let isLoading = false;

	async function handleRegister() {
		alert = null;
		if (password !== confirmPassword) {
			alert = { type: 'error', message: 'Las contraseñas no coinciden.' };
			return;
		}
		if (!selectedRole) {
			alert = { type: 'error', message: 'Por favor, selecciona un tipo de cuenta.' };
			return;
		}
		if (selectedRole === 'company' && !companyName.trim()) {
			alert = { type: 'error', message: 'El nombre de la empresa es requerido.' };
			return;
		}
		if (selectedRole !== 'company' && !displayName.trim()) {
			alert = { type: 'error', message: 'Tu nombre es requerido.' };
			return;
		}

		isLoading = true;
		const registrationData: RegistrationDetails = {
			email,
			pass: password,
			role: selectedRole,
			displayName: selectedRole !== 'company' ? displayName : undefined,
			companyName: selectedRole === 'company' ? companyName : undefined
		};

		const result = await registerUser(registrationData);
		isLoading = false;

		if (result.error) {
			alert = { type: 'error', message: result.error };
		} else if (result.user) {
			alert = { type: 'success', message: '¡Registro exitoso! Redirigiendo...' };
			// onAuthStateChanged en authStore debería manejar la actualización del estado.
			// El (public)/+layout.svelte o (app)/+layout.svelte debería redirigir.
			// Si necesitas forzar un rol simulado inmediatamente para la redirección:
			setSimulatedRoleInLocalStorage(selectedRole);

			// Esperar un poco para que el store se actualice y los layouts reaccionen
			setTimeout(() => {
				if (selectedRole === 'student') goto('/student/dashboard');
				else if (selectedRole === 'company') goto('/company/dashboard');
				else if (selectedRole === 'admin') goto('/admin/dashboard');
				else goto('/'); // Fallback
			}, 1000);
		}
	}
</script>

<div class="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-xl">
	<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Crear Cuenta</h2>
	{#if alert}
		<Alert {alert} on:dismiss={() => (alert = null)} class="mb-4" />
	{/if}
	<form on:submit|preventDefault={handleRegister} class="space-y-4">
		<div>
			<label for="role-select" class="mb-1 block text-sm font-medium text-gray-700"
				>Tipo de Cuenta</label
			>
			<select
				id="role-select"
				bind:value={selectedRole}
				class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
			>
				<option value="student">Estudiante</option>
				<option value="company">Empresa</option>
				<option value="admin">Administrador (Demo)</option>
			</select>
		</div>

		{#if selectedRole === 'student' || selectedRole === 'admin'}
			<Input
				label="Nombre Completo"
				type="text"
				bind:value={displayName}
				placeholder="Tu Nombre"
				required
			/>
		{/if}
		{#if selectedRole === 'company'}
			<Input
				label="Nombre de la Empresa"
				type="text"
				bind:value={companyName}
				placeholder="Nombre de tu Empresa"
				required
			/>
		{/if}

		<Input
			label="Correo Electrónico"
			type="email"
			bind:value={email}
			placeholder="tu@email.com"
			required
		/>
		<Input
			label="Contraseña"
			type="password"
			bind:value={password}
			placeholder="Mínimo 6 caracteres"
			required
		/>
		<Input
			label="Confirmar Contraseña"
			type="password"
			bind:value={confirmPassword}
			placeholder="Repite tu contraseña"
			required
		/>

		<Button type="submit" fullWidth {isLoading} disabled={isLoading}>
			{#if isLoading}
				Registrando...
			{:else}
				Registrarse
			{/if}
		</Button>
	</form>
	<p class="mt-4 text-center text-sm text-gray-600">
		¿Ya tienes cuenta? <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500"
			>Inicia sesión aquí</a
		>
	</p>
</div>
