<script lang="ts">
	import { PUBLIC_API_HOST } from "$env/static/public";


	let  avatar: string = ""; 
    let fileinput: HTMLInputElement;
    let image;
	
	const onFileSelected = (e: Event)=>{
    image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e => {
        avatar = e.target.result
    };
}

    function upload() {
        let formData = new FormData();
        console.log('image ', image)
        console.log(image)
        formData.append('image', image);
        const url = `${PUBLIC_API_HOST}/upload`
        console.log('url', url)
        fetch(url, {
            method: 'POST',
            body: formData
        }).then(res => res.json())
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }
	
</script>

<div class="flex flex-col justify-center items-center">
	<h1>Upload Image</h1>
  
        {#if avatar}
            <img class="avatar" src="{avatar}" alt="d" />
        {/if}
				<img class="upload" src="https://static.thenounproject.com/png/625182-200.png" alt="" on:click={()=>{fileinput.click();}} />
        <div class="chan" on:click={()=>{fileinput.click();}}>Choose Image</div>
        <input style="display:none" type="file" accept=".png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >

    <button class="btn btn-success" on:click={upload}>Save to server</button>
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

 