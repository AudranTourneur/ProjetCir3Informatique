<script lang="ts">
	import type { Plan } from '$lib/types';
	import Modal from '$lib/ui/Modal.svelte';

	export let toDelete: Plan|null = null;
    
    function confirmDelete() {
        console.log('confirm delete', toDelete);
        toDelete=null
    }

    let isActive = false;

    $: {
        if (toDelete) {
            isActive = true;
        }
        else {
            isActive = false;
        }
    }
</script>

<Modal bind:isActive={isActive}>
	<div slot="title">Supprimer le plan <span class="font-bold">{toDelete.name}</span>?</div>
	<div slot="content">
		<h1 class="my-4"><span class="font-bold">Avertissement:</span> cette action est irréversible</h1>
	</div>
	<div slot="buttons" class="p-2">
		<button class="mx-2 btn" on:click={() => (toDelete = null)}>Annuler</button>
		<button
			class="mx-2 btn btn-error"
			on:click={() => {
				confirmDelete();
			}}
		>
			Supprimer</button
		>
	</div>
</Modal>
