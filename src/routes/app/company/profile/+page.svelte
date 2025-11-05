<script lang="ts">
	import LoadingSpinner from '$lib/components/common/loadingSpinner.svelte';
	import CompanyProfileForm from '$lib/components/company/companyProfileForm.svelte';
	import type { Company } from '$lib/interfaces/user.interface';
	import { appUser, isLoadingAuth } from '$lib/stores/authStore';

	let company: Company | null = null;
	$: company = $appUser?.role === 'company' ? ($appUser as Company) : null;
	$: isLoading = $isLoadingAuth;
</script>

<svelte:head>
	<title>Perfil de Empresa - PasantíasPRO</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	{#if isLoading || !company}
		<div class="py-20 text-center">
			<LoadingSpinner size="xl" message="Cargando perfil de empresa..." />
		</div>
	{:else}
		<CompanyProfileForm {company} />
	{/if}
</div>
