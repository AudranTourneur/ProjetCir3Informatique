<script lang="ts">
	import { goto } from "$app/navigation";
	import { PUBLIC_API_HOST } from "$env/static/public";
	import type { Plan } from "$lib/types";
	import Modal from "$lib/ui/Modal.svelte";
    import ImageUpload from "./ImageUpload.svelte";

    export let toCreate: Plan | null = null; 

    let isActive = false;
    $: isActive = !!toCreate;

    
    let lastImageId = null;

   export let images: any[];

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

    let isLoading = false;

    const method = 'POST'
    const headers = {
        'Content-Type': 'application/json'
    }

    async function createWithUploadedImage() {
        const imageId = await upload();
        if (!imageId) return;

        if (!lastUploadedImage) return;

        console.log('lastUpload', lastUploadedImage)

        await fetch(`${PUBLIC_API_HOST}/createPlan`, {
            method, headers,
            body: JSON.stringify({
                name: toCreate.name,
                imageId,
            })
        })

        toCreate = null
    }

    async function createWithSelectedImage() {
        if (!selectedImage) return;
        console.log(selectedImage, toCreate)
        await fetch(`${PUBLIC_API_HOST}/createPlan`, {
            method, headers,
            body: JSON.stringify({
                name: toCreate.name,
                imageId: selectedImage,
            })
        })

        toCreate= null
    }

    async function create() {
        console.log('start upload', tabActive)

        isLoading = true

        if (tabActive === 'select')
            await createWithSelectedImage()
        else if (tabActive === 'upload')
            await createWithUploadedImage()
        
        isLoading = false

        goto('/admin')
        location.reload()
    }

    let isButtonDisabled = true;

    let selectedImage: any | null = null;

    $: {
        if (lastUploadedImage || selectedImage)
            isButtonDisabled = false
        else
            isButtonDisabled = true
        console.log('bjr ici', isButtonDisabled)
    }

    function selectImage(image: any) {
        selectedImage = image;
    }

    let tabActive: 'upload' | 'select' = 'upload'
  
</script>

{#if toCreate}
<Modal bind:isActive>
    <div slot="title" class="text-2xl">Création de plan</div>
    <div slot="content" class="w-full">
        <div class="form-control w-full max-w-xs">
        <label for="input-nom" class="label">
          <span class="label-text">Nom du plan</span>
        </label>
        <input bind:value={toCreate.name} id="input-nom" type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs" />
    </div>

        <div class="tabs">
          <button class="tab tab-bordered" class:tab-active={tabActive === 'upload'} on:click={() => tabActive = 'upload'}>Téleverser une image</button> 
          <button class="tab tab-bordered" class:tab-active={tabActive === 'select'} on:click={() => tabActive = 'select'}>Sélectionner une image existante</button>
        </div>

        <div class:hidden={tabActive !== 'upload'}>
            <ImageUpload bind:lastUploadedImage />
        </div>
            <div class="flex-1 overflow-y-scroll h-[40vh]" class:hidden={tabActive !== 'select'} >
                {#each images as image}
                    <button class="w-40 h-40  {selectedImage === image ? 'border-4 border-red-500' : 'hover:border hover:border-red-500'} border-2 hover:cursor-pointer" on:click={() => selectImage(image)}>
                        <img src="{PUBLIC_API_HOST}/images/{image}.png?miniature=true" alt="" width="300" height="300">
                    </button>
                {/each}
            </div>
    </div>
    <div slot="buttons">
        <button class="btn" on:click={()=> toCreate = null}>Annuler</button>
        <button class="btn btn-success" on:click={create} disabled={isButtonDisabled} class:loading={isLoading}>Créer</button>
    </div>
</Modal>
{/if}