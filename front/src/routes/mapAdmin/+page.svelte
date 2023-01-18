<script lang="ts">
    import { Floor } from '$lib/Floor';
    import type { Room } from '$lib/Room'
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { writable, type Writable } from 'svelte/store';
	import { fly, slide } from 'svelte/transition';



    let isAdding = false;
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

    let tabPoint : Number[][] = [];
    let idSelectedFloor = 0;

    let numberOfPoint = 0;

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
        .scaleExtent([innerWidth/width,4.5])
        )

        .append("g")
        .attr("id","main-svg")
        .on("click", (event) => {
            if(isAdding) {
                let pointer = d3.pointer(event);
                if(numberOfPoint == 0) {
                    numberOfPoint++;
                    
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
                        numberOfPoint = 0;
                        isAdding = false;

                        let data = {
                            points: tabPoint,
                            name: "nom"+tabFloor[idSelectedFloor],
                            capacity: 10,
                            projecteur: true,
                        };
                        tabFloor[idSelectedFloor].newRoom(data);

                        console.log(data)

                        tabPoint = [];
                        svg.selectAll("circle").remove()
                        svg.selectAll("polyline").remove()
                    })
                } else {
                    numberOfPoint++;
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

        let tabFloor : Floor[] = [];

        setTimeout(() => {
            height = image.node()?.getBBox().height!;
            console.log(height);
            svg.attr("height", height)

            let roomData = {
                points: points.map(p => [p[0] * width, p[1] * height]),
                name: "nom1",
                capacity: 10,
                projecteur: true,
            };

            tabFloor = [new Floor([roomData],"bonjour", currentlySelectedRoom)];
            tabFloor[idSelectedFloor].draw()
        }, 1000)
        //.attr("height", height)
	});

    function cancelSelection() {
        console.log('cancel')
        isAdding = false;
        tabPoint = [];
        const svg = d3.select('#main-svg')
        svg.selectAll("circle").remove()
        svg.selectAll("polyline").remove()
        numberOfPoint = 0
    }

    function startDraw() {
      isAdding = true
    }

    function unselect() {
        d3.selectAll("#main-svg > polygon").attr('stroke', '#f00');
        $currentlySelectedRoom = null
    }

    function edit() {

    }
</script>

<div class="absolute overflow-hidden" bind:this={el}></div>


<!-- Span bottom edge -->
<div class="absolute left-0 bottom-0 w-full">
  <div class="absolute inset-x-0 bottom-0">
    {#if !$currentlySelectedRoom}
        <div class="flex justify-center  bg-black bg-opacity-50 p-2" transition:slide>
            {#if !isAdding}
                <button class="btn btn-primary" on:click={startDraw}>Draw room borders</button>
            {:else}
                <button class="btn btn-warning" on:click={cancelSelection}>Cancel</button>
            {/if}
        </div> 
    {:else}
        <div class="flex justify-center  bg-black bg-opacity-50 p-2 h-[300px]" transition:slide>
            <span>oui {$currentlySelectedRoom.name}</span>
            <button class="btn" on:click={unselect}>Dé-selectionner</button>  
            <button class="btn btn-info" on:click={edit}>Modifer</button>  
        </div> 
    {/if}
  </div>
</div>

<style>
    :global(html, body) {
        overflow: hidden;
    }
</style>
