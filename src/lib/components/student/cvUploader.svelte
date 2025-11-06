<script lang="ts">
	import type { AlertMessage } from '$lib/interfaces/common.interface';
	import type { Student } from '$lib/interfaces/user.interface';
	import { internshipService } from '$lib/services/internship.service';
	import { appUser } from '$lib/stores/authStore';
	import { createEventDispatcher } from 'svelte';
	import Alert from '$lib/components/common/alert.svelte';
	import Button from '$lib/components/common/button.svelte';
	export let currentCvUrl: string | undefined = undefined;
	export let currentCvFileName: string | undefined = undefined;

	const dispatch = createEventDispatcher();
	let student = $appUser as Student; // Asumimos que el que usa este componente es un estudiante

	let selectedFile: File | null = null;
	let isLoading = false;
	let alertMsg: AlertMessage | null = null;
	let dragOver = false;

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			selectedFile = input.files[0];
			alertMsg = null; // Limpiar alertas previas
			// Validar tipo de archivo y tamaño aquí si es necesario
			if (selectedFile.type !== 'application/pdf') {
				alertMsg = { type: 'error', message: 'Solo se permiten archivos PDF.' };
				selectedFile = null;
				return;
			}
			if (selectedFile.size > 5 * 1024 * 1024) {
				// 5MB Límite
				alertMsg = { type: 'error', message: 'El archivo es demasiado grande (máx 5MB).' };
				selectedFile = null;
				return;
			}
		}
	}

	async function handleUpload() {
		if (!selectedFile || !student?.uid) {
			alertMsg = { type: 'error', message: 'Por favor, selecciona un archivo PDF para subir.' };
			return;
		}
		isLoading = true;
		alertMsg = null;
		try {
			const result = await internshipService.uploadStudentCV(student.uid, selectedFile);
			currentCvUrl = result.cvUrl;
			currentCvFileName = result.cvFileName;
			alertMsg = { type: 'success', message: `CV "${result.cvFileName}" subido exitosamente.` };
			dispatch('cvUploaded', result); // Emitir evento para que el padre actualice el perfil
			selectedFile = null; // Limpiar selección
		} catch (error: any) {
			alertMsg = {
				type: 'error',
				message: 'Error al subir el CV: ' + (error.message || 'Inténtalo de nuevo.')
			};
		} finally {
			isLoading = false;
		}
	}

	// Drag and Drop handlers
	function handleDragEnter(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}
	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
	}
	function handleDragOver(e: DragEvent) {
		e.preventDefault(); // Necesario para permitir el drop
	}
	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const fileInput = document.getElementById('cv-file-input') as HTMLInputElement;
			fileInput.files = e.dataTransfer.files;
			// Disparar el evento change manualmente para que handleFileSelect se active
			const event = new Event('change', { bubbles: true });
			fileInput.dispatchEvent(event);
		}
	}
</script>

<div class="space-y-4 rounded-lg bg-white p-6 shadow {$$props.class || ''}">
	<h3 class="text-lg font-medium text-gray-700">Tu Curriculum Vitae (CV)</h3>

	{#if alertMsg}
		<Alert alert={alertMsg} on:dismiss={() => (alertMsg = null)} />
	{/if}

	{#if currentCvFileName}
		<div
			class="flex items-center justify-between rounded-md border border-green-200 bg-green-50 p-3"
		>
			<div>
				<p class="text-sm font-medium text-green-700">CV Actual:</p>
				<a
					href={currentCvUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="truncate text-sm text-green-600 hover:underline"
				>
					{currentCvFileName}
				</a>
			</div>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 text-green-500"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
		<p class="text-xs text-gray-500">Para actualizar tu CV, selecciona un nuevo archivo abajo.</p>
	{/if}

	<div
		class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6
           {dragOver ? 'border-indigo-500 bg-indigo-50' : ''}"
		on:dragenter={handleDragEnter}
		on:dragleave={handleDragLeave}
		on:dragover={handleDragOver}
		on:drop={handleDrop}
	>
		<div class="space-y-1 text-center">
			<svg
				class="mx-auto h-12 w-12 text-gray-400 {dragOver ? 'text-indigo-500' : ''}"
				stroke="currentColor"
				fill="none"
				viewBox="0 0 48 48"
				aria-hidden="true"
			>
				<path
					d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<div class="flex text-sm text-gray-600 {dragOver ? 'text-indigo-700' : ''}">
				<label
					for="cv-file-input"
					class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:outline-none hover:text-indigo-500"
				>
					<span>Sube un archivo</span>
					<input
						id="cv-file-input"
						name="cv-file-input"
						type="file"
						class="sr-only"
						accept=".pdf"
						on:change={handleFileSelect}
					/>
				</label>
				<p class="pl-1 {dragOver ? 'text-indigo-600' : ''}">o arrástralo aquí</p>
			</div>
			<p class="text-xs text-gray-500 {dragOver ? 'text-indigo-500' : ''}">PDF (MAX. 5MB)</p>
		</div>
	</div>

	{#if selectedFile}
		<div class="text-sm text-gray-700">
			Archivo seleccionado: <span class="font-medium">{selectedFile.name}</span> ({(
				selectedFile.size /
				1024 /
				1024
			).toFixed(2)} MB)
		</div>
	{/if}

	<Button
		onClick={handleUpload}
		disabled={!selectedFile || isLoading}
		{isLoading}
		fullWidth
		variant={currentCvUrl ? 'secondary' : 'primary'}
	>
		{#if isLoading}Subiendo...{:else}{currentCvUrl ? 'Actualizar CV' : 'Subir CV'}{/if}
	</Button>
</div>
