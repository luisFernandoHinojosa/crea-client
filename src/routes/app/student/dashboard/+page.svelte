<script>
	// Puedes agregar lógica aquí si lo necesitas
	function volverAtras() {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			window.location.href = '/'; // Si no hay historial, vuelve al inicio
		}
	}
</script>

<div
	class="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
>
	<div class="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl md:p-12">
		<!-- Iconos SVG -->
		<div class="mb-6 flex justify-center gap-4">
			<!-- Casco de construcción -->
			<svg class="h-16 w-16 animate-bounce text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 2C10.9 2 10 2.9 10 4V6H14V4C14 2.9 13.1 2 12 2Z" />
				<path d="M4 8C4 7.45 4.45 7 5 7H19C19.55 7 20 7.45 20 8V9H4V8Z" />
				<path d="M4 10H20V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V10Z" />
				<ellipse cx="12" cy="14" rx="3" ry="2" fill="white" opacity="0.3" />
			</svg>

			<svg
				class="h-16 w-16 animate-pulse text-gray-600"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
				/>
			</svg>
		</div>

		<h1 class="mb-4 text-3xl font-bold text-gray-800">Estamos Trabajando en Esta Página</h1>

		<p class="mb-6 leading-relaxed text-gray-600">
			Nuestro equipo está construyendo algo increíble para ti. Vuelve pronto para ver las novedades.
		</p>

		<!-- Puntos animados -->
		<div class="mb-6 flex justify-center gap-2">
			<div class="h-3 w-3 animate-bounce rounded-full bg-indigo-500"></div>
			<div
				class="h-3 w-3 animate-bounce rounded-full bg-indigo-500"
				style="animation-delay: 0.2s;"
			></div>
			<div
				class="h-3 w-3 animate-bounce rounded-full bg-indigo-500"
				style="animation-delay: 0.4s;"
			></div>
		</div>

		<button
			on:click={volverAtras}
			class="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-indigo-700"
		>
			Volver al Inicio
		</button>
	</div>
</div>
