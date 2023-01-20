<script lang="ts">
	import ModalPlanDelete from './ModalPlanDelete.svelte';
	import PreviewPlan from '$lib/PreviewPlan.svelte';
	import ModalPlanCreate from './ModalPlanCreate.svelte';
	import type { Plan } from '../../../../../back/src/types';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data;

	const images = data.images;
	const plans = data.plans;

	let planToDelete: Plan | null = null;

	let planInCreation: Plan | null = null;

	function createNewPlan() {
		console.log('create new plan');
		planInCreation = {
			_id: '',
			name: 'Plan sans nom',
			imageId: '',
			rooms: [],
			description: '',
			isPublic: false
		};
	}

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        window.location.href = '/';
    }

	function switchToPlan() {
		goto('/plan')
		setTimeout(() => {
			location.reload()
		}, 700)
	}

	onMount(async () => {
		const res = await fetch(`${PUBLIC_API_HOST}/isAdmin`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: localStorage.getItem('token'),
				email: localStorage.getItem('email')
			})
		})

		const data = await res.json()

		if (data.status === 0) {
			localStorage.removeItem('token');
			localStorage.removeItem('email');
			setTimeout(() => {
				location.href = '/';
				switchToPlan()
			}, 500)
		}
	})
</script>

<div class="m-4 flex flex-col">
	  <div class="flex justify-between m-2">
        <a href="/plan" on:click={switchToPlan} class="text-lg sm:text-xl md:text-2xl lg:text-3xl">
			<span><i class="fa-solid fa-repeat"></i></span>
			 Page utilisateur
        </a>
        <button on:click={logout} class="text-error text-2xl hover:cursor-pointer">
            <span><i class="fa-solid fa-right-from-bracket"></i></span>
            <span class="hidden sm:inline">Se déconnecter</span> </button>
    </div>
	<div>Mes plans :</div>
	<div class="grid grid-cols-1 xl:grid-cols-2">
		{#each plans as plan}
			<div class="m-2">
				<PreviewPlan {plan} bind:toDelete={planToDelete} mode='admin' />
			</div>
		{/each}
	</div>
	<div>
		<button class="btn btn-info gap-2" on:click={createNewPlan}>
			<span><i class="fa-solid fa-plus" /></span>
			Créer un nouveau plan
		</button>
	</div>
</div>

{#if planToDelete}
	<ModalPlanDelete bind:toDelete={planToDelete} />
{/if}

{#if planInCreation}
	<ModalPlanCreate bind:toCreate={planInCreation} {images} />
{/if}
