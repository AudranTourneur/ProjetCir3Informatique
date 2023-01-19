<script lang="ts">
    import { Floor } from '$lib/Floor';
    import type { Room } from '$lib/Room'
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { writable, type Writable } from 'svelte/store';
	import { slide } from 'svelte/transition';



    let isAdding = false;
    let isModifying = false;
    let el : HTMLDivElement;

    let currentlySelectedRoom: Writable<Room | null> = writable(null)

    let inputName : string;
    let inputCapacity : number;
    let inputProjecteur : boolean;

    let tabPoint : number[][] = [];

    let idSelectedFloor = 0;


    let points = []

    export let floor = new Floor([], 'Name', currentlySelectedRoom);

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
        .on("click", (event) => {
            if(isAdding) {
                let pointer = d3.pointer(event);
                if(tabPoint.length == 0) {
                    tabPoint.push([pointer[0],pointer[1]]);

                    svg.append("polyline")
                    .attr("points",tabPoint.toString())
                    .style("stroke", "blue")      // set the line colour
                    .style("fill", "none");      // set the fill colour

                    svg.append("circle")
                    .attr("cx", pointer[0])
                    .attr("cy", pointer[1])
                    .attr("r", 10)               // set the radius
                    .style("stroke", "yellow")      // set the line colour
                    .style("fill", "yellow")      // set the fill colour
                    .on("click", () => {
                        isAdding = false;

                        let data = {
                            points: tabPoint,
                            name: "nom"+floor.name,
                            capacity: 10,
                            projecteur: true,
                        };
                        floor.newRoom(data);

                        console.log(data)

                        tabPoint = [];
                        svg.selectAll("circle").remove()
                        svg.selectAll("polyline").remove()
                    })
                } else {
                    tabPoint.push([pointer[0],pointer[1]]);

                    svg.append("circle")
                    .attr("cx", pointer[0])
                    .attr("cy", pointer[1])
                    .attr("r", 4)               // set the radius
                    .style("stroke", "red")      // set the line colour
                    .style("fill", "red");      // set the fill colour

                    svg.append("polyline")
                    .attr("points",tabPoint.toString())
                    .style("stroke", "blue")      // set the line colour
                    .style("fill", "none");      // set the fill colour
                }
            }
        })

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
            floor.update()
        }, 1000)
	});

    function cancelSelection() {
        isAdding = false;
        tabPoint = [];
        const svg = d3.select('#main-svg')
        svg.selectAll("circle").remove()
        svg.selectAll("polyline").remove()
    }

    function startDraw() {
      isAdding = true
    }

    function unselect() {
        d3.selectAll("#main-svg > polygon").attr('stroke', '#f00');
        firstTime = false;
        $currentlySelectedRoom = null
    }


    function saveInput() {
        $currentlySelectedRoom!.name = inputName;
        $currentlySelectedRoom!.capacity = inputCapacity;
        $currentlySelectedRoom!.projecteur = inputProjecteur;
    }
    function cancelInput() {
        inputName = $currentlySelectedRoom!.name;
        inputCapacity = $currentlySelectedRoom!.capacity;
        inputProjecteur = $currentlySelectedRoom!.projecteur;
    }

    function edit() {
        if (!$currentlySelectedRoom) return;
        isModifying = true;
        $currentlySelectedRoom.editPolygon()
    }

    let firstTime = false;

    $: {
        if ($currentlySelectedRoom && !firstTime) {
            firstTime = true;

            inputName = $currentlySelectedRoom!.name;
            inputCapacity = $currentlySelectedRoom!.capacity;
            inputProjecteur = $currentlySelectedRoom!.projecteur;
        }
    }

    function del() {
        if (!$currentlySelectedRoom) return;
        floor.delete($currentlySelectedRoom);
        floor.update()
        unselect();
    }

    function finishEdition() {
        isAdding = false;
        isModifying = false;
        if (!$currentlySelectedRoom) return;
        $currentlySelectedRoom.stopEditPolygon();
    }
</script>

<div class="absolute overflow-hidden" bind:this={el}></div>


<!-- Span bottom edge -->
<div class="absolute left-0 bottom-0 w-full">
  <div class="absolute inset-x-0 bottom-0">
    {#if !$currentlySelectedRoom}
        <div class="flex justify-center  bg-black bg-opacity-50 p-2 gap-2" transition:slide>
            {#if !isAdding}
                <button class="btn btn-primary" on:click={startDraw}>Dessiner des salles</button>
                <button class="btn btn-success" on:click={finishEdition}>Terminer l'édition</button>
            {:else}
                <button class="btn btn-warning" on:click={cancelSelection}>Cancel</button>
            {/if}
        </div>
    {:else}
        {#if !isModifying}
            <div class="flex justify-center  bg-black bg-opacity-70 p-2 h-[500px]" transition:slide>
                <div class="flex flex-col gap-2"> 
                    <div class="form-control w-full max-w-xs">
                    <label for="input-nom" class="label">
                        <span class="label-text text-white">Nom de la salle</span>
                    </label>
                    <input id="input-nom" bind:value={inputName} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs input-sm input-info" />
                    </div>

                    <div class="form-control w-full max-w-xs">
                    <label for="input-capacite" class="label">
                        <span class="label-text text-white">Capacité de la salle</span>
                    </label>
                    <input id="input-capacite" bind:value={inputCapacity} type="text" placeholder="Type here" class="input input-bordered w-full max-w-xs input-sm input-info" />
                    </div>

                    <div class="text-white">Projecteur :
                        <input class="toggle toggle-info" type="checkbox" bind:checked={inputProjecteur}/>
                    </div>
                    <div>
                        <button class="btn btn-warning btn-outline" on:click={cancelInput}>Annuler</button>
                        <button class="btn btn-success" on:click={saveInput}>Sauvegarder</button>
                    </div>
                    <button class="btn btn-info" on:click={edit}>Modifer</button>
                    <button class="btn btn-error" on:click={del}>Supprimer</button>
                    <button class="btn btn-primary" on:click={unselect}>OK</button>
                </div>
            </div>
        {:else}
            <div class="flex justify-center  bg-black bg-opacity-70 p-2" transition:slide>
                <button class="btn btn-primary" on:click={finishEdition}>Terminer l'édition</button>
            </div>
        {/if}
    {/if}
  </div>
</div>

<style>
    :global(html, body) {
        overflow: hidden;
    }
</style>
