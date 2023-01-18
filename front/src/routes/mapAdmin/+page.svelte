<script lang="ts">
    import { Floor } from '$lib/Floor';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';



    let isAdding = false;
    let el : HTMLDivElement;
	
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

    const width = window.innerWidth;
    const height = window.innerHeight;


    let roomData = {
        points: points.map(p => [p[0] * width, p[1] * height]),
        name: "nom1",
        capacity: 10,
        projecteur: true,
    };


        
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
        .attr("transforme","scale:"+innerWidth/4000);

        let image = svg.append('image')
        .attr('xlink:href', '/Etage_2_clean.png')
        .attr("width", width)

        setTimeout(() => {

        console.log('image', image, image.node()?.getBBox())
        }, 1)
        //.attr("height", height)

        let tabFloor : Floor[] = [];

        tabFloor = [new Floor([roomData],"bonjour")];

        tabFloor[idSelectedFloor].draw()
        console.log(d3.select("svg"));
	});

    function cancelSelection() {
        console.log('cancel')
        isAdding = false;
        tabPoint = [];
        const svg = d3.select('#main-svg')
        svg.selectAll("circle").remove()
        svg.selectAll("polyline").remove()
        numberOfPoints = 0
    }

    function startDraw() {
      isAdding = true
    }
</script>

<div class="absolute overflow-hidden" bind:this={el}></div>


<!-- Span bottom edge -->
<div class="absolute left-0 bottom-0 w-full">
  <div class="absolute inset-x-0 bottom-0">
    <div class="flex justify-center  bg-black bg-opacity-50 p-2">

        {#if !isAdding}
            <button class="btn btn-primary" on:click={startDraw}>Draw room borders</button>
        {:else}
            <button class="btn btn-warning" on:click={cancelSelection}>Cancel</button>
        {/if}
    </div> 
  </div>
</div>

<style>
    :global(html, body) {
        overflow: hidden;
    }
</style>
