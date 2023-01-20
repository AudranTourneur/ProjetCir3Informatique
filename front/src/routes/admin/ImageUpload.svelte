<script lang="ts">
	import { PUBLIC_API_HOST } from "$env/static/public";

    export let lastUploadedImage: any = null;

	let  imageUrl: string = ""; 
    let fileinput: HTMLInputElement;
    let image;
	
	const onFileSelected = (e: Event)=>{
        console.log('event', e)
        image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e => {
            imageUrl = e.target.result as string;
            lastUploadedImage = image;
            console.log(imageUrl, lastUploadedImage)
        };
    }
	
</script>

<div class="flex flex-col justify-center items-center">
	<h1>Téléverser </h1>
  
        {#if imageUrl}
            <img class="avatar" src="{imageUrl}" alt="d" />
        {/if}
				<img class="upload" src="https://static.thenounproject.com/png/625182-200.png" alt="" on:click={()=>{fileinput.click();}} />
        <div class="chan" on:click={()=>{fileinput.click();}}>PNG seulement</div>
        <input style="display:none" type="file" accept=".png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >
</div>


<style>
	.upload{
		display:flex;
	height:50px;
		width:50px;
		cursor:pointer;
	}
	.avatar{
		display:flex;
		height:200px;
		width:200px;
	}
</style>

 