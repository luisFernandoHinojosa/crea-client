<script lang="ts">
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import type { Company } from '$lib/interfaces/user.interface';
	import { updateUserProfile } from '$lib/services/auth.service';
	import { onMount } from 'svelte';
	import Alert from '../common/alert.svelte';
	import Input from '../common/input.svelte';
	import Button from '../common/button.svelte';

	export let company: Company; // El perfil actual de la empresa se pasa como prop

	let companyName = '';
	let email = ''; // El email usualmente no se cambia desde aquí, o requiere verificación.
	let website = '';
	let description = '';
	let industry = '';
	let address = '';
	// Considerar campos para logo, etc.

	let isLoading = false;
	let alertMsg: AlertMessage | null = null;

	onMount(() => {
		if (company) {
			companyName = company.companyName || '';
			email = company.email || ''; // Generalmente no editable
			website = company.website || '';
			description = company.description || '';
			industry = company.industry || '';
			address = company.address || '';
		}
	});

	async function handleSubmit() {
		if (!company) return;
		alertMsg = null;
		isLoading = true;

		const updatedProfileData: Partial<Company> = {
			companyName,
			// email, // No permitir edición de email aquí fácilmente
			website: website || undefined,
			description: description || undefined,
			industry: industry || undefined,
			address: address || undefined,
			displayName: companyName // Actualizar displayName en Firebase Auth también
		};

		try {
			await updateUserProfile(company.uid, updatedProfileData);
			// El store appUser se actualizará dentro de updateUserProfile si la UID coincide
			alertMsg = { type: 'success', message: 'Perfil de la empresa actualizado exitosamente.' };
		} catch (error: any) {
			alertMsg = { type: 'error', message: 'Error al actualizar el perfil: ' + error.message };
		} finally {
			isLoading = false;
		}
	}
</script>

<form
	on:submit|preventDefault={handleSubmit}
	class="space-y-6 rounded-lg bg-white p-6 shadow-lg md:p-8"
>
	<h2 class="mb-6 border-b pb-3 text-2xl font-semibold text-gray-800">Editar Perfil de Empresa</h2>

	{#if alertMsg}
		<Alert alert={alertMsg} on:dismiss={() => (alertMsg = null)} class="mb-4" />
	{/if}

	<Input
		label="Nombre de la Empresa"
		bind:value={companyName}
		placeholder="Tu Nombre de Empresa S.A."
		required
	/>
	<Input
		label="Correo Electrónico de Contacto"
		bind:value={email}
		type="email"
		placeholder="contacto@empresa.com"
		readonly
		disabled
		hint="El correo electrónico no se puede cambiar desde aquí."
	/>
	<Input label="Sitio Web" bind:value={website} type="url" placeholder="https://tuempresa.com" />
	<Input
		label="Industria"
		bind:value={industry}
		placeholder="Ej: Tecnología, Marketing, Finanzas"
	/>
	<Input label="Dirección (Opcional)" bind:value={address} placeholder="Calle Falsa 123, Ciudad" />

	<div>
		<label for="description" class="mb-1 block text-sm font-medium text-gray-700"
			>Descripción de la Empresa</label
		>
		<textarea
			id="description"
			bind:value={description}
			rows={5}
			class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			placeholder="Cuéntanos sobre tu empresa, su cultura, misión, etc."
		></textarea>
	</div>

	<div class="pt-4">
		<Button type="submit" {isLoading} disabled={isLoading} fullWidth size="lg">
			{#if isLoading}
				Guardando Cambios...
			{:else}
				Guardar Cambios
			{/if}
		</Button>
	</div>
</form>
