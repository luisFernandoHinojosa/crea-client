<script lang="ts">
	import { appUser } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/common/button.svelte';

	function exploreInternships() {
		if ($appUser?.role === 'student') {
			goto('/app/student/internships');
		} else {
			goto('/auth/login');
		}
	}
</script>

<div class="py-16 text-center">
	<h1 class="mb-6 text-5xl font-extrabold text-gray-900">
		Encuentra tu Próxima <span class="text-indigo-600">Oportunidad</span> Profesional
	</h1>
	<p class="mx-auto mb-10 max-w-2xl text-xl text-gray-600">
		Conectamos a estudiantes talentosos con empresas innovadoras para pasantías que impulsan
		carreras.
	</p>
	<div class="space-x-4">
		<Button size="lg" onClick={exploreInternships}>Explorar Pasantías</Button>
		{#if !$appUser}
			<Button size="lg" variant="secondary" onClick={() => goto('/auth/login')}
				>Registrarse como Empresa</Button
			>
		{:else if $appUser.role === 'company'}
			<Button size="lg" variant="secondary" onClick={() => goto('/app/company/internships/create')}
				>Publicar Pasantía</Button
			>
		{/if}
	</div>

	<div class="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-3 text-2xl font-semibold text-indigo-700">Para Estudiantes</h3>
			<p class="text-gray-600">
				Descubre pasantías, aplica con facilidad y gestiona tus postulaciones en un solo lugar.
			</p>
		</div>
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-3 text-2xl font-semibold text-indigo-700">Para Empresas</h3>
			<p class="text-gray-600">
				Publica ofertas, encuentra candidatos calificados y gestiona tu proceso de selección
				eficientemente.
			</p>
		</div>
		<div class="rounded-lg bg-white p-6 shadow-lg">
			<h3 class="mb-3 text-2xl font-semibold text-indigo-700">Conexiones Valiosas</h3>
			<p class="text-gray-600">
				Facilitamos el encuentro entre el talento emergente y las necesidades del mercado laboral.
			</p>
		</div>
	</div>
</div>
