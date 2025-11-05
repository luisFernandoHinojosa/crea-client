<script lang="ts">
	export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md'; // p-0, p-4, p-6, p-8
	export let shadow: 'sm' | 'md' | 'lg' | 'xl' | 'none' = 'md';
	export let rounded: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'none' = 'lg';
	export let borderColor: string | undefined = undefined; // e.g., 'border-blue-500'

	const paddingClasses = {
		none: 'p-0',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};

	const shadowClasses = {
		none: 'shadow-none',
		sm: 'shadow-sm',
		md: 'shadow-md',
		lg: 'shadow-lg',
		xl: 'shadow-xl'
	};

	const roundedClasses = {
		none: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		full: 'rounded-full'
	};

	let baseClasses = 'bg-white overflow-hidden';
	if (borderColor) {
		baseClasses += ` border ${borderColor}`;
	} else {
		baseClasses += ` border border-gray-200`; // Borde por defecto
	}
</script>

<div
	class="{baseClasses}
         {paddingClasses[padding]}
         {shadowClasses[shadow]}
         {roundedClasses[rounded]}
         {$$props.class || ''}"
>
	{#if $$slots.header}
		<div class="mb-4 border-b border-gray-200 pb-4">
			<slot name="header"></slot>
		</div>
	{/if}
	<slot />
	{#if $$slots.footer}
		<div class="mt-4 border-t border-gray-200 pt-4">
			<slot name="footer"></slot>
		</div>
	{/if}
</div>
