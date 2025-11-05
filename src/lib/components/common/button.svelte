<script lang="ts">
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let onClick: (() => void) | undefined = undefined;
	export let disabled = false;
	export let isLoading = false; // Para mostrar un spinner
	export let fullWidth = false;
	export let variant: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' = 'primary';
	export let size: 'sm' | 'md' | 'lg' | 'icon' = 'md'; // 'icon' para botones solo con ícono

	const baseClasses =
		'inline-flex items-center justify-center font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out';

	const sizeClasses = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base',
		icon: 'p-2' // Ajusta según el tamaño del ícono
	};

	const variantClasses = {
		primary:
			'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white border border-transparent',
		secondary:
			'bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500 text-indigo-700 border border-transparent',
		danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white border border-transparent',
		outline:
			'bg-transparent hover:bg-indigo-50 focus:ring-indigo-500 text-indigo-700 border border-indigo-300',
		ghost:
			'bg-transparent hover:bg-indigo-50 focus:ring-indigo-500 text-indigo-700 border border-transparent'
	};
	const disabledClasses = 'opacity-50 cursor-not-allowed';

	let effectiveDisabled: boolean;
	$: effectiveDisabled = disabled || isLoading;
</script>

<button
	{type}
	on:click={onClick}
	disabled={effectiveDisabled}
	class="{baseClasses}
         {sizeClasses[size]}
         {variantClasses[variant]}
         {fullWidth ? 'w-full' : ''}
         {effectiveDisabled ? disabledClasses : ''}
         {$$props.class || ''}"
>
	{#if isLoading}
		<svg
			class="mr-3 -ml-1 h-5 w-5 animate-spin {variant === 'primary' || variant === 'danger'
				? 'text-white'
				: 'text-indigo-700'}"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
		Procesando...
	{:else}
		<slot />
	{/if}
</button>
