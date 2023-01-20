<script lang="ts">
	import { PUBLIC_API_HOST } from "$env/static/public";
	import PreviewPlan from "$lib/PreviewPlan.svelte";
	import { onMount } from "svelte";
	import ModalPlanCreate from "../admin/ModalPlanCreate.svelte";
	import ModalPlanDelete from "../admin/ModalPlanDelete.svelte";


    export let data;

    let plans: Plan[] = data.plans;

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        window.location.href = '/';
    }

    let isAdmin = false
    let email = ''

    onMount(async () => {
        email = localStorage.getItem('email') || ''
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

        if (data.status === 1) {
            isAdmin = true
        }
    })

	const images = data.images;

	let planToDelete: any = null;

	let planInCreation: any = null;

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


</script>  

<div class="m-4 flex-flex-col gap-8">
    <div class="flex justify-between m-2">
        <div class="flex gap-2">
            <span>
                <i class="fa-solid fa-user"></i>
            </span>
            <div>{email}</div>
        </div>
        <button on:click={logout} class="text-error text-2xl hover:cursor-pointer">
            <span><i class="fa-solid fa-right-from-bracket"></i></span>
            <span class="hidden sm:inline">Se déconnecter</span> </button>
    </div>

    {#each plans as plan}
    <div class="m-2">
        {#if !isAdmin}
            <PreviewPlan {plan} mode='user' />
        {:else}
           <PreviewPlan {plan} bind:toDelete={planToDelete} mode='admin' />
        {/if}
    </div> 
    {/each}
</div>


{#if isAdmin}
    <div class="m-4 flex-flex-col gap-8">
        <button class="btn btn-info gap-2" on:click={createNewPlan}>
            <span><i class="fa-solid fa-plus" /></span>
            Créer un nouveau plan
        </button>
    </div>
{/if}

{#if planToDelete}
	<ModalPlanDelete bind:toDelete={planToDelete} />
{/if}

{#if planInCreation}
	<ModalPlanCreate bind:toCreate={planInCreation} {images} />
{/if}

