<script lang="ts">
	import PreviewPlan from "$lib/PreviewPlan.svelte";
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
			}, 1000)
		}
</script>  

<div class="m-4 flex-flex-col gap-8">
    <div class="flex justify-between m-2">
        <a href="/admin" on:click={reloadPage} class="text-lg sm:text-xl md:text-2xl lg:text-3xl">
			<span><i class="fa-solid fa-repeat"></i></span>
            Page d'administration
        </a>
        <button on:click={logout} class="text-error text-2xl hover:cursor-pointer">
            <span><i class="fa-solid fa-right-from-bracket"></i></span>
            <span class="hidden sm:inline">Se déconnecter</span> </button>
    </div>

{#each plans as plan}
    <PreviewPlan {plan} mode='user' />
{/each}
</div>