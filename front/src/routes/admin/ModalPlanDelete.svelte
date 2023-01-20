<script lang="ts">
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { Plan } from '$lib/types';
	import Modal from '$lib/ui/Modal.svelte';

	export let toDelete: Plan|null = null;
    
    async function confirmDelete() {
        console.log('confirm delete', toDelete);

		const toSend = {
			email: localStorage.getItem('email'),
			token: localStorage.getItem('token'),
			planId: toDelete?._id,
		}

		console.log(toSend)

		await fetch(`${PUBLIC_API_HOST}/deletePlan`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(toSend),
			}
		)

		location.reload()

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
