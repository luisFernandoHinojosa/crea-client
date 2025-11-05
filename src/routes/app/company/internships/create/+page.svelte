<script lang="ts">
	import { appUser } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import type { Internship } from '$lib/interfaces/internship.interface';
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import { internshipService } from '$lib/services/internship.service';
	import Alert from '$lib/components/common/alert.svelte';
	import Input from '$lib/components/common/input.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import type { Company } from '$lib/interfaces/user.interface';

	let currentCompany = $appUser as Company; // Asumimos que el layout ya validó el rol

	let title = '';
	let description = '';
	let requirementsStr = ''; // Comma-separated
	let responsibilitiesStr = ''; // Comma-separated
	let location = 'Remoto';
	let modality: Internship['modality'] = 'Full-time';
	let duration = '';
	let paid = false;
	let salaryRange = '';
	let closingDate = ''; // YYYY-MM-DD
	let tagsStr = ''; // Comma-separated

	let isLoading = false;
	let alertMsg: AlertMessage | null = null;

	async function handleSubmit() {
		alertMsg = null;
		isLoading = true;

		if (!title || !description || !currentCompany?.uid || !currentCompany?.companyName) {
			alertMsg = {
				type: 'error',
				message: 'Por favor, completa los campos obligatorios: Título y Descripción.'
			};
			isLoading = false;
			return;
		}

		const newInternshipData: Omit<
			Internship,
			'id' | 'postedDate' | 'applicationsCount' | 'status'
		> = {
			companyId: currentCompany.uid,
			companyName: currentCompany.companyName,
			title,
			description,
			requirements: requirementsStr
				.split(',')
				.map((r) => r.trim())
				.filter((r) => r),
			responsibilities: responsibilitiesStr
				.split(',')
				.map((r) => r.trim())
				.filter((r) => r),
			location,
			modality,
			duration: duration || undefined,
			paid,
			salaryRange: paid && salaryRange ? salaryRange : undefined,
			closingDate: closingDate || undefined,
			tags: tagsStr
				.split(',')
				.map((t) => t.trim())
				.filter((t) => t)
		};

		try {
			const createdInternship = await internshipService.createInternship(newInternshipData);
			alertMsg = {
				type: 'success',
				message: `Pasantía "${createdInternship.title}" publicada exitosamente.`
			};
			setTimeout(() => {
				goto(`/company/internships`); // O a la vista de la pasantía creada
			}, 2000);
		} catch (error: any) {
			alertMsg = { type: 'error', message: 'Error al publicar la pasantía: ' + error.message };
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Publicar Nueva Pasantía - {currentCompany?.companyName}</title>
</svelte:head>

<div class="container mx-auto max-w-3xl px-4 py-8">
	<h1 class="mb-2 text-3xl font-bold text-gray-800">Publicar Nueva Pasantía</h1>
	<p class="mb-8 text-gray-600">Completa los detalles para encontrar al candidato ideal.</p>

	{#if alertMsg}
		<Alert alert={alertMsg} on:dismiss={() => (alertMsg = null)} class="mb-6" />
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-6 rounded-lg bg-white p-8 shadow-lg">
		<Input
			label="Título de la Pasantía"
			bind:value={title}
			placeholder="Ej: Desarrollador Web Junior"
			required
		/>
		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700"
				>Descripción Detallada</label
			>
			<textarea
				id="description"
				bind:value={description}
				rows={5}
				class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				placeholder="Describe la pasantía, el proyecto, el equipo, etc."
				required
			></textarea>
		</div>
		<Input
			label="Requisitos (separados por coma)"
			bind:value={requirementsStr}
			placeholder="Ej: HTML, CSS, JavaScript, Figma"
		/>
		<Input
			label="Responsabilidades (separadas por coma)"
			bind:value={responsibilitiesStr}
			placeholder="Ej: Desarrollar UI, Participar en reuniones, Testear código"
		/>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<Input
				label="Ubicación"
				bind:value={location}
				placeholder="Ej: Remoto, Ciudad XYZ, Híbrido"
			/>
			<div>
				<label for="modality" class="mb-1 block text-sm font-medium text-gray-700">Modalidad</label>
				<select
					id="modality"
					bind:value={modality}
					class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
				>
					<option value="Full-time">Full-time</option>
					<option value="Part-time">Part-time</option>
					<option value="Flexible">Flexible</option>
				</select>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<Input label="Duración (Ej: 3 meses)" bind:value={duration} placeholder="Opcional" />
			<div>
				<span class="mb-1 block text-sm font-medium text-gray-700">¿Es Remunerada?</span>
				<div class="mt-2 space-x-4">
					<label class="inline-flex items-center">
						<input type="radio" class="form-radio text-indigo-600" bind:group={paid} value={true} />
						<span class="ml-2">Sí</span>
					</label>
					<label class="inline-flex items-center">
						<input
							type="radio"
							class="form-radio text-indigo-600"
							bind:group={paid}
							value={false}
						/>
						<span class="ml-2">No</span>
					</label>
				</div>
			</div>
		</div>

		{#if paid}
			<Input
				label="Rango Salarial (Opcional)"
				bind:value={salaryRange}
				placeholder="Ej: $500 - $700 USD"
			/>
		{/if}

		<Input
			label="Fecha de Cierre de Postulaciones (Opcional)"
			type="date"
			bind:value={closingDate}
		/>
		<Input
			label="Etiquetas (separadas por coma)"
			bind:value={tagsStr}
			placeholder="Ej: Frontend, React, Diseño, Marketing"
		/>

		<div class="pt-4">
			<Button type="submit" {isLoading} disabled={isLoading} fullWidth size="lg">
				{#if isLoading}
					Publicando...
				{:else}
					Publicar Pasantía
				{/if}
			</Button>
		</div>
	</form>
</div>
