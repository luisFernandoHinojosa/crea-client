<script lang="ts">
	import { goto } from '$app/navigation';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import { loginUser } from '$lib/services/auth.service';
	import { appUser } from '$lib/stores/authStore';
	import type { Role } from '$lib/types/user';
	import { onMount } from 'svelte';
	import Button from '$lib/components/common/button.svelte';
	import Input from '$lib/components/common/input.svelte';

	let email = '';
	let password = '';
	let currentErrorMsg: AlertMessage | null = null; // Cambiado para permitir null
	let isLoading = false;
	let selectedRole: Role = 'company';

	// Redirigir si ya hay un usuario logueado
	onMount(() => {
		const unsubscribe = appUser.subscribe((user) => {
			if (user && user.role) {
				// Si hay usuario y tiene rol
				// Esperar un instante para que el resto de la app se estabilice si es necesario
				setTimeout(() => {
					if (user.role === 'student') goto('/app/student/internships', { replaceState: true });
					else if (user.role === 'company') goto('/app/company/dashboard', { replaceState: true });
					else if (user.role === 'admin') goto('/app/admin/dashboard', { replaceState: true });
				}, 0);
				unsubscribe();
			}
		});
		// Asegurarse de desuscribir si el componente se destruye antes de la redirección
		return () => unsubscribe();
	});

	async function handleLogin() {
		currentErrorMsg = null; // Limpiar error previo
		isLoading = true;
		if (!email || !password || !selectedRole) {
			currentErrorMsg = {
				id: 'login-form-error',
				type: 'error',
				message: 'Por favor, completa todos los campos y selecciona un rol.'
			};
			isLoading = false;
			return;
		}

		// Llamar a la función loginUser del authService (que ahora es la simulada)
		const result = await loginUser(email, password, selectedRole);
		isLoading = false;

		if (result.error) {
			currentErrorMsg = { id: 'login-error', type: 'error', message: result.error };
		} else if (result.user) {
			// La redirección se manejará por el store `userRole` y el layout,
			// o podrías forzarla aquí si el layout no la pilla a tiempo.
			// El store userRole se actualiza derivado de appUser, que se setea en loginUser.
			// La lógica de suscripción a userRole para goto es un buen enfoque aquí.
			const roleValueFromLogin = result.user.role;
			if (roleValueFromLogin) {
				if (roleValueFromLogin === 'student') goto('/app/student/internships');
				else if (roleValueFromLogin === 'company') goto('/app/company/dashboard');
				else if (roleValueFromLogin === 'admin') goto('/app/admin/dashboard');
				else {
					console.warn('Rol desconocido después del login:', roleValueFromLogin);
					goto('/auth/login'); // Fallback
				}
			} else {
				// Esto no debería suceder si loginUser siempre devuelve un usuario con rol.
				currentErrorMsg = {
					id: 'role-error',
					type: 'error',
					message: 'No se pudo determinar el rol del usuario.'
				};
			}
		}
	}
</script>

<div class="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-xl">
	<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
	{#if currentErrorMsg && currentErrorMsg.message}
		<alert
			alert={currentErrorMsg}
			dismissible
			on:dismiss={() => (currentErrorMsg = null)}
			class="mb-4"
		/>
	{/if}
	<form on:submit|preventDefault={handleLogin} class="space-y-4">
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
			placeholder="********"
			required
		/>

		<div>
			<label for="role-select" class="mb-1 block text-sm font-medium text-gray-700"
				>Ingresar como:</label
			>
			<select
				id="role-select"
				bind:value={selectedRole}
				class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
			>
				<option value="student">Estudiante</option>
				<option value="company">Empresa</option>
				<option value="admin">Administrador</option>
			</select>
		</div>

		<Button type="submit" fullWidth disabled={isLoading} {isLoading}>
			{#if !isLoading}
				Ingresar
			{/if}
		</Button>
	</form>
	<p class="mt-4 text-center text-sm text-gray-600">
		¿No tienes cuenta? <a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500"
			>Regístrate aquí</a
		>
	</p>
</div>
<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import { loginUser } from '$lib/services/auth.service';
	import { userRole } from '$lib/stores/authStore';
	import type { Role } from '$lib/types/user';
	import Alert from '../common/alert.svelte';
	import Button from '../common/button.svelte';
	import Input from '../common/input.svelte';

	let email = '';
	let password = '';
	let errorMsg: AlertMessage = { id: '', type: 'error', message: '' };
	let isLoading = false;
	let selectedRole: Role = 'student'; // Default role selection for login simulation

	async function handleLogin() {
		errorMsg = { id: '', type: 'error', message: '' };
		isLoading = true;
		if (!email || !password || !selectedRole) {
			errorMsg = {
				id: '',
				type: 'error',
				message: 'Por favor, completa todos los campos y selecciona un rol.'
			};
			isLoading = false;
			return;
		}
		const result = await loginUser(email, password, selectedRole); // Pasamos el rol simulado
		isLoading = false;
		if (typeof result === 'string') {
			errorMsg = { id: '', type: 'error', message: result };
		} else {
			// onAuthStateChanged en authStore se encargará de la redirección basada en rol
			// o puedes forzar una aquí si es necesario.
			// Por ahora, asumimos que el +layout.svelte de (app) gestionará la redirección.
			// Espera a que el store se actualice para asegurar que el rol esté disponible para el layout
			const unsubscribe = userRole.subscribe((roleValue) => {
				if (roleValue) {
					// Si el rol ya está en el store
					unsubscribe(); // Importante desuscribirse para evitar múltiples redirecciones
					if (roleValue === 'student') goto('/student/dashboard');
					else if (roleValue === 'company') goto('/company/dashboard');
					else if (roleValue === 'admin') goto('/admin/dashboard');
					else goto('/login'); // O una página de "selecciona tu rol"
				}
			});
		}
	}
</script>

<div class="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-xl">
	<h2 class="mb-6 text-center text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
	{#if errorMsg}
		<Alert
			alert={errorMsg}
			dismissible
			on:dismiss={() => (errorMsg = { id: '', type: 'error', message: '' })}
		/>
	{/if}
	<form on:submit|preventDefault={handleLogin} class="space-y-4">
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
			placeholder="********"
			required
		/>

		<div>
			<label for="role-select" class="mb-1 block text-sm font-medium text-gray-700"
				>Ingresar como:</label
			>
			<select
				id="role-select"
				bind:value={selectedRole}
				class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
			>
				<option value="student">Estudiante</option>
				<option value="company">Empresa</option>
				<option value="admin">Administrador</option>
			</select>
		</div>

		<Button type="submit" fullWidth disabled={isLoading}>
			{#if isLoading}
				<span
					class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
					role="status"
					aria-label="loading"
				></span>
				Procesando...
			{:else}
				Ingresar
			{/if}
		</Button>
	</form>
	<p class="mt-4 text-center text-sm text-gray-600">
		¿No tienes cuenta? <a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500"
			>Regístrate aquí</a
		>
	</p>
</div> -->
