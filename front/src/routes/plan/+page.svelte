<script lang="ts">
	import { PUBLIC_API_HOST } from "$env/static/public";
	import PreviewPlan from "$lib/PreviewPlan.svelte";
	import { onMount } from "svelte";
	import type { Plan } from "../../../../back/src/types";


    export let data;

    let plans: Plan[] = data.plans;

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        window.location.href = '/';
    }

    function reloadPage() {
		setTimeout(() => {
			location.reload()
		}, 200)
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
           <PreviewPlan {plan} mode='admin' />
        {/if}
    </div> 
    {/each}
</div>