<script lang="ts">
	import type { Plan } from "$lib/types";
	import Modal from "$lib/ui/Modal.svelte";
    import ImageUpload from "./ImageUpload.svelte";

    export let toCreate: Plan | null = null; 

    let isActive = false;
    $: isActive = !!toCreate;

    function create() {
        toCreate= null
    }
</script>

<Modal bind:isActive>
    <div slot="title" class="text-2xl">Création de plan</div>
    <div slot="content" class="w-full">
        <div class="form-control w-full max-w-xs">
        <label for="input-nom" class="label">
          <span class="label-text">Nom du plan</span>
        </label>
        <input id="input-nom" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
    </div>

        <div class="flex flex-col w-full lg:flex-row">
            <ImageUpload />
            <div class="divider lg:divider-horizontal">OU</div> 
            <div class="grid flex-grow h-32 card bg-base-300 rounded-box place-items-center">Sélectionner une image</div>
        </div>
    </div>
    <div slot="buttons">
        <button class="btn" on:click={()=> toCreate = null}>Annuler</button>
        <button class="btn btn-success" on:click={create}>Créer</button>
    </div>
</Modal>