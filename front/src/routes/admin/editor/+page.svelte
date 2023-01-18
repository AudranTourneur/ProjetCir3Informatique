<script lang="ts">
    import AdminNavbar from "../AdminNavbar.svelte";
	import ModalPlanDelete from "./ModalPlanDelete.svelte";
	import PreviewPlan from "./PreviewPlan.svelte";
	import ModalPlanCreate from "./ModalPlanCreate.svelte";
    import type {Plan} from '../../../../../back/src/types'

 export let data

   const images = data.images

    let plans = [
        {id: 1, name: 'Plan 1', description: 'Description du plan 1'},
    ]

    let planToDelete: Plan | null = null;

    let planInCreation: Plan | null = null

    function createNewPlan() {
        console.log('create new plan');
        planInCreation = {
		    id: '',
		    name: 'Plan 1',
		    imageId: '',
		    rooms: [],
		    description: '',
		    isPublic: false,
	    }

        

        fetch('http://localhost:3000/plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(planInCreation)
        })
    }
</script>

<AdminNavbar tabActive={'editor'}></AdminNavbar>

<div class="m-4 flex flex-col">
    <div>
        Mes plans : 
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-2">
        {#each plans as plan}
            <div class="m-2">
                <PreviewPlan {plan} bind:toDelete={planToDelete}  ></PreviewPlan>
            </div>
        {/each}
    </div>
    <div>
        <button class="btn btn-info gap-2" on:click={createNewPlan}>
            <span><i class="fa-solid fa-plus"></i></span>
            Créer un nouveau plan
        </button>
    </div>
</div>

{#if planToDelete}
    <ModalPlanDelete bind:toDelete={planToDelete}></ModalPlanDelete>
{/if}

{#if planInCreation}
    <ModalPlanCreate bind:toCreate={planInCreation} {images}></ModalPlanCreate>
{/if}