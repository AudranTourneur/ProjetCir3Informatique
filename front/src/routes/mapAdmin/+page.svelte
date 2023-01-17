<script lang="ts">
    import { Floor } from '$lib/Floor';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

    let isAdding = false;
    let el : HTMLDivElement;
	
    let points = [
        [50, 50],
        [50, 150],
        [150, 150],
        [150, 50],
        [100, 100],
    ];

    let tabPoint : Number[][] = [];

    let data = {
        points: points,
        name: "nom1",
        capacity: 10,
        projecteur: true,
    };

    let idSelectedFloor = 0;

	onMount(() => {
        let numberOfPoint = 0;
        
        let svg = d3.select(el)
                    .append("svg")
                    .attr("width", innerWidth)
                    .attr("height", innerHeight)
                    .style('background-color', 'lightgrey')
                    // @ts-ignore
                    .call(d3.zoom()
                    .on("zoom", (event) => {
                        svg.attr("transform", event.transform)
                    })
                    .scaleExtent([1,4.5])
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
                                .attr("r", 3)               // set the radius
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
                    });
        
                let image = svg.append('image')
                .attr('xlink:href', '/Etage_2_clean.png')
                .attr("width", innerWidth)
                .attr("height", innerHeight)

                console.log(image);

        let tabFloor : Floor[] = [];
    
        tabFloor = [new Floor([data],"bonjour")];

        tabFloor[idSelectedFloor].draw();
        console.log(d3.select("svg"));
	});
</script>

<div bind:this={el}></div>
<button on:click={()=>{isAdding = !isAdding}}>isAdding = {isAdding}</button>
<button on:click={()=>{}}>Draw</button>