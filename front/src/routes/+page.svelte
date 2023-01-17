<script>
	import { Room } from '../lib/Room.ts';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	
    let points = [
        [50, 50],
        [50, 150],
        [150, 150],
        [150, 50],
        [100, 100],
    ];

    let tabPoints = [points];

    let isAdding = false;
    let numberOfPoint = 0;
    let tabPolygon = new Array;
    let idSelectedPolygon;

	let el;

	onMount(() => {
        let svg = d3.select(el)
                    .append("svg")
                    .attr("width", window.innerWidth)
                    .attr("height", window.innerHeight)
                    .style('background-color', 'lightgrey')
                    .call(d3.zoom().on("zoom", (event) => {
                        svg.attr("transform", event.transform)
                    }))
                    .append("g")
                    .on("click", (event) => {
                        if(isAdding) {
                            let pointer = d3.pointer(event);
                            if(numberOfPoint == 0) {
                                numberOfPoint++;
                                
                                tabPoints.push([[pointer[0],pointer[1]]]);

                                svg.append("polyline")
                                .attr("points",tabPoints[tabPoints.length-1])
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

                                    let polygon = svg.append("polygon")
                                    .attr('points', tabPoints[tabPoints.length-1])
                                    .attr('stroke', '#f00')
                                    .attr('fill', 'red')
                                    .style("fill-opacity", .2)
                                    .on("click", () => {
                                        tabPolygon.forEach(element => {
                                            element.attr('stroke', '#f00')
                                        });
                                        polygon.attr('stroke', '#ff0');
                                        idSelectedPolygon=tabPolygon.length;
                                    });

                                    tabPolygon.push(polygon);
                                    console.log(tabPolygon);

                                    svg.selectAll("circle").remove()
                                    svg.selectAll("polyline").remove()
                                })
                            } else {
                                numberOfPoint++;
                                tabPoints[tabPoints.length-1].push([pointer[0],pointer[1]]);

                                svg.append("circle")
                                .attr("cx", pointer[0])
                                .attr("cy", pointer[1])
                                .attr("r", 4)               // set the radius
                                .style("stroke", "red")      // set the line colour
                                .style("fill", "red");      // set the fill colour

                                svg.append("polyline")
                                .attr("points",tabPoints[tabPoints.length-1])
                                .style("stroke", "blue")      // set the line colour
                                .style("fill", "none");      // set the fill colour
                            }
                        }
                    });
        
                svg.append('image')
                .attr('xlink:href', 'src/routes/20200504-Plans-41BV.svg')
                .attr("width", window.innerWidth)
                .attr("height", window.innerHeight)

        let polygon = svg.append("polygon")
            .attr('points', tabPoints[tabPoints.length-1])
            .attr('stroke', '#f00')
            .attr('fill', 'red')
            .style("fill-opacity", .2)
            .on("click", () => {
                tabPolygon.forEach(element => {
                    element.attr('stroke', '#f00')
                });
                polygon.attr('stroke', '#ff0');
                idSelectedPolygon=tabPolygon.length;
            });
            
        tabPolygon.push(polygon);
	});
</script>

<style>
	.chart :global(div) {
		font: 10px sans-serif;
		background-color: steelblue;
		text-align: right;
		padding: 3px;
		margin: 1px;
		color: white;
	}
</style>

<div bind:this={el} class="chart"></div>
<button on:click={()=>{isAdding = !isAdding}}>isAdding = {isAdding}</button>