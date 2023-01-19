<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ClientMap from './ClientMap.svelte';

	export let data;

	const plan = data.plan;

	onMount(() => {
		console.log('plan');
		if (!plan) {
			goto('/');
			setTimeout(() => {
				location.reload();
			}, 1000);
		}
	});
</script>

{#if plan}
<ClientMap {plan} />
{:else}
Plan invalide, vous allez être redirigé...
{/if}
