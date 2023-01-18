<script lang="ts">
	//import { managePixi } from '$lib/pixiTest';
	//import { startPixiApp } from '$lib/pixi/app';
    import {onMount} from 'svelte'

    let div: HTMLDivElement

    onMount(async () => {
        //managePixi()
        const {managePixi} = await import('$lib/pixi/pixiTest')
        console.log('hi')
        //startPixiApp()
        managePixi(div)
    })
</script>

<div id="container-pixi" bind:this={div}></div>

