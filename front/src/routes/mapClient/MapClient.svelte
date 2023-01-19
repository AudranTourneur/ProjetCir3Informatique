<script lang="ts">
    import { Floor } from '$lib/Floor';
    import type { Room } from '$lib/Room'
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { writable, type Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import TimePlan from './TimePlan.svelte';
    import { Datepicker } from 'svelte-calendar'

    let el : HTMLDivElement;

    let currentlySelectedRoom: Writable<Room | null> = writable(null)
	
    //let points = [
    //    [50, 50],
    //    [50, 150],
    //    [150, 150],
    //    [150, 50],
    //    [100, 100],
    //].map((p) => [p[0] + 100, p[1] + 300])

    let points = [
        [0, 0],
        [0.5, 0.5],
        [0, 1]
    ]

    let idSelectedFloor = 0;

    let date = new Date();
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    
    let infoDate = {
        "year": year,
        "month": month,
        "day": day
    }

    let tabFloor : Floor[] = [];

	onMount(() => {

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let svg = d3.select(el)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style('background-color', 'lightgrey')
    // @ts-ignore
    .call(d3.zoom()
    .on("zoom", (event) => {
        svg.attr("transform", event.transform)
    })
    .scaleExtent([(innerWidth/width)-0.4,4.5])
    )
    .append("g")
    .attr("id","main-svg")
    let image = svg.append('image')
    .attr('xlink:href', '/Etage_2_clean.png')
    .attr("width", width)

    setTimeout(() => {
        height = image.node()?.getBBox().height!;
        svg.attr("height", height)

        let roomData = {
            points: points.map(p => [p[0] * width, p[1] * height]),
            name: "nom1",
            capacity: 10,
            projecteur: true,
        };
        tabFloor.push(new Floor([roomData],"bonjour", currentlySelectedRoom));
        tabFloor[idSelectedFloor].update()
    }, 1000);
	});

    function unselect() {
        d3.selectAll("#main-svg > polygon").attr('stroke', '#f00');
        $currentlySelectedRoom = null
    }

    function saveInput() {

    }
    function cancelInput() {

    }

    function finishEdition() {
        if (!$currentlySelectedRoom) return;
    }
</script>



<div class="absolute overflow-hidden" bind:this={el}></div>

<!-- Span bottom edge -->
<div class="absolute left-0 bottom-0 w-full">
    <div class="absolute inset-x-0 bottom-0">
    {#if !$currentlySelectedRoom}
        <div class="flex justify-center  bg-black bg-opacity-50 p-2 gap-2" transition:slide>
            <button class="btn btn-success" on:click={finishEdition}>Terminer l'édition</button>
        </div>
    {:else}
        <div class="flex justify-center  bg-black bg-opacity-70 p-2 h-[500px]" transition:slide>
            <div class="flex flex-col gap-2"> 
                <div class="form-control w-full max-w-xs">
                    <label for="input-nom" class="label">
                        <span class="label-text text-white">Nom de la salle : </span>
                    </label>
                    <span class="label-text text-white">{$currentlySelectedRoom.name}</span>
                </div>

                <div class="form-control w-full max-w-xs">
                    <label for="input-capacite" class="label">
                        <span class="label-text text-white">Capacité de la salle : </span>
                    </label>
                    <span class="label-text text-white">{$currentlySelectedRoom.capacity}</span>
                </div>

                <div class="text-white">
                    <label for="input-capacite" class="label">
                        <span class="label-text text-white">Projecteur : </span>
                    </label>
                    {#if $currentlySelectedRoom.projecteur}
                        <span class="label-text text-white">oui</span>
                    {:else}
                        <span class="label-text text-white">non</span>
                    {/if}
                </div>
                <div>
                    <button class="btn btn-warning btn-outline" on:click={cancelInput}>Annuler</button>
                    <button class="btn btn-success" on:click={saveInput}>Sauvegarder</button>
                </div>
                <button class="btn btn-primary w-[400px]" on:click={unselect}>OK</button>
                <div class="absolute bottom-2 left-0">
                    <TimePlan bind:infoDate={infoDate}>

                    </TimePlan >
                </div>
            </div>
        </div>
    {/if}
  </div>
</div>

<style>
    :global(html, body) {
        overflow: hidden;
    }
</style>
