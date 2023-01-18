<script lang="ts">
	import { PUBLIC_API_HOST } from "$env/static/public";
	import type { Plan } from "$lib/types";
	import Modal from "$lib/ui/Modal.svelte";
    import ImageUpload from "./ImageUpload.svelte";

    export let toCreate: Plan | null = null; 

    let isActive = false;
    $: isActive = !!toCreate;

    
    let lastImageId = null;

   export let images;

   let lastUploadedImage: any | null = null;

    async function upload(): Promise<string> {
        const image = lastUploadedImage
        if (!image) return '';
        let formData = new FormData();
        formData.append('image', image);

        const url = `${PUBLIC_API_HOST}/upload`
        const serverRes = await fetch(url, {
            method: 'POST',
            body: formData
        })
        const res = await serverRes.json()
        if (res.id)
            lastImageId = res.id

        console.log('server responded with', res)
        return res.id
    }

    async function create() {
        if (!lastUploadedImage) return;
        const imageId = await upload();
        if (!imageId) return;

        fetch(`${PUBLIC_API_HOST}/createPlan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Plan 1',
                imageId,
                rooms: [],
                description: '',
                isPublic: false,
            })
        }


        toCreate= null
    }

    let isButtonDisabled = true;

    $: {
        if (!lastUploadedImage) 
            isButtonDisabled = true
        else
            isButtonDisabled = false
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
            <ImageUpload bind:lastUploadedImage />
            <div class="divider lg:divider-horizontal">OU</div> 
            <div class="flex flex-col overflow-y-scroll h-[40vh]">
                {#each images as image}
                    <div class="flex flex-grow h-32 rounded-box place-items-center">
                        <img src="{PUBLIC_API_HOST}/images/{image}" alt="" width="300" height="300">
                    </div>
                {/each}
            </div>
        </div>
    </div>
    <div slot="buttons">
        <button class="btn" on:click={()=> toCreate = null}>Annuler</button>
        <button class="btn btn-success" on:click={create} disabled={isButtonDisabled}>Créer</button>
    </div>
</Modal>