<script lang="ts">
    import { initKonva } from "$lib/konva/initKonva";
	import { onMount } from "svelte";

    onMount(() => {
        initKonva();
    });
</script>  

<div id="container-konva"></div>