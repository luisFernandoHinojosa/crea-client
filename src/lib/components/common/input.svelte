<script lang="ts">
	export let value: string | number = '';
	export let label: string = '';
	export let id: string =
		label.toLowerCase().replace(/\s+/g, '-') || `input-${Math.random().toString(36).substring(7)}`;
	export let type: 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url' = 'text';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let disabled: boolean = false;
	export let readonly: boolean = false;
	export let error: string = ''; // Mensaje de error
	export let hint: string = ''; // Pequeña ayuda debajo del input
	export let leadingIcon: string | undefined = undefined; // e.g., SVG path data for an icon

	let finalClass = $$props.class || ''; // Permite pasar clases adicionales

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (type === 'number') {
			value = target.valueAsNumber;
		} else {
			value = target.value;
		}
	}
</script>

<div class="w-full {finalClass}">
	{#if label}
		<label for={id} class="mb-1 block text-sm font-medium text-gray-700"
			>{label}
			{#if required}<span class="text-red-500">*</span>{/if}</label
		>
	{/if}
	<div class="relative rounded-md shadow-sm">
		{#if leadingIcon}
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<svg
					class="h-5 w-5 text-gray-400"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path fill-rule="evenodd" d={leadingIcon} clip-rule="evenodd" />
				</svg>
			</div>
		{/if}
		<input
			{type}
			{id}
			bind:value
			on:input={handleInput}
			{placeholder}
			{required}
			{disabled}
			{readonly}
			aria-invalid={error ? 'true' : undefined}
			aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
			class="block w-full rounded-md border px-3 py-2 sm:text-sm
             {leadingIcon ? 'pl-10' : ''}
             {error
				? 'border-red-500 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
				: 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}
             {disabled || readonly ? 'cursor-not-allowed bg-gray-50' : 'bg-white'}"
		/>
	</div>
	{#if error}
		<p class="mt-1 text-xs text-red-600" id="{id}-error">{error}</p>
	{/if}
	{#if hint && !error}
		<p class="mt-1 text-xs text-gray-500" id="{id}-hint">{hint}</p>
	{/if}
</div>
