<script lang="ts">
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import type { Student } from '$lib/interfaces/user.interface';
	import { updateUserProfile } from '$lib/services/auth.service';
	import { onMount, createEventDispatcher } from 'svelte';
	import CvUploader from './cvUploader.svelte';
	import Alert from '../common/alert.svelte';
	import Input from '../common/input.svelte';
	import Button from '../common/button.svelte';

	export let student: Student; // El perfil actual del estudiante

	let displayName = '';
	let email = ''; // No editable usualmente
	let bio = '';
	let skillsStr = ''; // Comma-separated
	// Para educación y experiencia, necesitarías una UI más compleja (lista de objetos)
	// Por simplicidad, aquí no los incluimos en el formulario editable básico.
	let cvUrlCurrent: string | undefined;
	let cvFileNameCurrent: string | undefined;

	let isLoading = false;
	let alertMsg: AlertMessage | null = null;
	const dispatch = createEventDispatcher();

	onMount(() => {
		if (student) {
			displayName = student.displayName || '';
			email = student.email || '';
			bio = student.bio || '';
			skillsStr = student.skills?.join(', ') || '';
			cvUrlCurrent = student.cvUrl;
			cvFileNameCurrent = student.cvFileName;
		}
	});

	async function handleSubmit() {
		if (!student) return;
		alertMsg = null;
		isLoading = true;

		const updatedProfileData: Partial<Student> = {
			displayName,
			bio: bio || undefined,
			skills:
				skillsStr
					.split(',')
					.map((s) => s.trim())
					.filter((s) => s) || undefined
			// CV se maneja por CVUploader, pero podríamos necesitar actualizar el store aquí
			// si CVUploader no lo hace globalmente.
		};

		try {
			await updateUserProfile(student.uid, updatedProfileData);
			alertMsg = { type: 'success', message: 'Perfil actualizado exitosamente.' };
			dispatch('profileUpdated'); // Para notificar al padre si es necesario
		} catch (error: any) {
			alertMsg = { type: 'error', message: 'Error al actualizar el perfil: ' + error.message };
		} finally {
			isLoading = false;
		}
	}

	function handleCvUploaded(event: CustomEvent<{ cvUrl: string; cvFileName: string }>) {
		// Actualizar el estado local y potencialmente el store global si no lo hace el servicio
		cvUrlCurrent = event.detail.cvUrl;
		cvFileNameCurrent = event.detail.cvFileName;
		// Para que el form sepa que hay un nuevo CV y no lo borre si no se guarda el form
		if (student) {
			student.cvUrl = cvUrlCurrent;
			student.cvFileName = cvFileNameCurrent;
		}
		alertMsg = {
			type: 'info',
			message: `CV "${event.detail.cvFileName}" listo. Guarda tu perfil para confirmar todos los cambios.`
		};
	}
</script>

<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
	<div class="lg:col-span-1">
		<CvUploader
			currentCvUrl={cvUrlCurrent}
			currentCvFileName={cvFileNameCurrent}
			on:cvUploaded={handleCvUploaded}
			class="mb-6 lg:mb-0"
		/>
	</div>

	<form
		on:submit|preventDefault={handleSubmit}
		class="space-y-6 rounded-lg bg-white p-6 shadow-lg md:p-8 lg:col-span-2"
	>
		<h2 class="mb-6 border-b pb-3 text-2xl font-semibold text-gray-800">
			Editar Perfil de Estudiante
		</h2>

		{#if alertMsg}
			<Alert alert={alertMsg} on:dismiss={() => (alertMsg = null)} class="mb-4" />
		{/if}

		<Input
			label="Nombre Completo"
			bind:value={displayName}
			placeholder="Tu Nombre Apellido"
			required
		/>
		<Input
			label="Correo Electrónico"
			bind:value={email}
			type="email"
			readonly
			disabled
			hint="El correo electrónico no se puede cambiar desde aquí."
		/>

		<div>
			<label for="bio" class="mb-1 block text-sm font-medium text-gray-700"
				>Tu Bio / Resumen Profesional</label
			>
			<textarea
				id="bio"
				bind:value={bio}
				rows={4}
				class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				placeholder="Una breve descripción sobre ti, tus intereses y objetivos profesionales."
			></textarea>
		</div>

		<Input
			label="Habilidades (separadas por coma)"
			bind:value={skillsStr}
			placeholder="Ej: Svelte, JavaScript, Figma, Comunicación"
		/>

		<div class="pt-4">
			<Button type="submit" {isLoading} disabled={isLoading} fullWidth size="lg">
				{#if isLoading}
					Guardando Cambios...
				{:else}
					Guardar Cambios en Perfil
				{/if}
			</Button>
		</div>
	</form>
</div>
