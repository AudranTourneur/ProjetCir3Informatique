<script lang="ts">
    import { onMount } from 'svelte';
    import ModalTime from './ModalTime.svelte'
    import * as d3 from 'd3';

    export let infoDate;

    let time : HTMLDivElement;
    let width = window.innerWidth;
    let height = 96;
    let cursorx1 : d3.Selection<SVGRectElement, unknown, null, undefined> | null = null;
    let cursorx2 : d3.Selection<SVGRectElement, unknown, null, undefined> | null = null;
    let reservation : d3.Selection<SVGRectElement, unknown, null, undefined> | null = null;
    let line : d3.Selection<SVGRectElement, unknown, null, undefined> | null = null;
    let svg : d3.Selection<SVGGElement, unknown, null, undefined> | null = null;

    infoDate.year
    infoDate.month
    infoDate.day

    let infoModal1 = new Date(infoDate.year,infoDate.month,infoDate.day);
    let infoModal2 = new Date(infoDate.year,infoDate.month,infoDate.day);

    let showModal1 = false;
    let showModal2 = false;

    onMount(() => {
        svg = d3.select(time)
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")

        console.log("BONJOUR")

        svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height-4)
            .attr('stroke', 'black')
            .attr('fill', 'lightgreen');

        let x = d3.scaleLinear()
            .domain([8, 20])
            .range([ 0, width - 16]);

        svg.append("g")
            .attr("transform", "translate(8,"+(height-24)+")")
            .call(d3.axisBottom(x));

        svg.append('rect')
            .attr('x', 8)
            .attr('y', 8)
            .attr('width', width - 16)
            .attr('height', height - 32)
            .attr('stroke', 'black')
            .attr('fill', 'lightgreen')
            .on("mousemove",(event) => {
                if(!cursorx2) {
                    let pointer = d3.pointer(event);
                    line?.remove()
                    
                    line = svg!.append('rect')
                    .attr('x', getNearest(pointer[0])-1.5)
                    .attr('y', 9)
                    .attr('width', 3)
                    .attr('height', height - 33)
                    .attr('stroke', 'black')
                    .attr('fill', 'black')
                    .on("click",() => {
                        handleRect(event);
                    })
                }
            })
            .on("click",(event) => {
                handleRect(event);
            })
    })

    function getNearest(x : number) {
        let ratio = x/(width - 16);
        let value : number;
        if(ratio%(1/(12*4))> (1/(12*4))/2 ) {
            value = (ratio + ((1/(12*4)) - ratio%(1/(12*4))))*(width - 16) + 8;
        }
        else {
            value=  (ratio - ratio%(1/(12*4)))*(width - 16) + 8
        }

        if(value < 8) {
            return 8
        }
        if(value > (width - 16)) {
            return width - 8
        }
        return value
    }

    function handleRect(event : any) {
        let pointer = d3.pointer(event);
        if(cursorx1 && !cursorx2) {
            line?.remove();
            cursorx2 = svg!.append('rect')
            .attr('x', getNearest(pointer[0]) - 1.5)
            .attr('y', 9)
            .attr('width', 3)
            .attr('height', height - 34)
            .attr('stroke', 'darkgrey')
            .attr('fill', 'darkgrey')
            // @ts-ignore
            .call(d3.drag()
                .on("start", ()=>{
                    console.log("dragstart")
                    cursorx2?.attr("stroke", "black");
                })
                .on("drag", (event)=>{
                    cursorx2?.attr("x", getNearest(event.x))
                    //@ts-ignore
                    reservation.attr('x', Math.min(cursorx1.node()?.getBBox().x, cursorx2.node()?.getBBox().x))
                    //@ts-ignore
                    .attr('width', Math.abs(cursorx1.node()?.getBBox().x - 1.5 - cursorx2.node()?.getBBox().x))
                })
                .on("end", ()=>{
                    cursorx2?.attr("stroke", "darkgrey");
                })
            )

            reservation = svg!.append('rect')
            //@ts-ignore
            .attr('x', Math.min(cursorx1.node()?.getBBox().x, cursorx2.node()?.getBBox().x))
            .attr('y', 9)
            //@ts-ignore
            .attr('width', Math.abs(cursorx1.node()?.getBBox().x - 1.5 - cursorx2.node()?.getBBox().x))
            .attr('height', height - 34)
            .attr('stroke', 'grey')
            .attr('fill', 'grey')

            cursorx1.raise()
            cursorx2.raise()
        } else if (!cursorx1 && !cursorx2) {
            cursorx1 = svg!.append('rect')
            .attr('x', getNearest(pointer[0]) - 1.5)
            .attr('y', 9)
            .attr('width', 3)
            .attr('height', height - 34)
            .attr('stroke', 'darkgrey')
            .attr('fill', 'darkgrey')
            // @ts-ignore
            .call(d3.drag()
                .on("start", ()=>{
                    console.log("dragstart")
                    cursorx1?.attr("stroke", "black");
                })
                .on("drag", (event)=>{
                    cursorx1?.attr("x", getNearest(event.x))
                    //@ts-ignore
                    reservation.attr('x', Math.min(cursorx1.node()?.getBBox().x, cursorx2.node()?.getBBox().x))
                    //@ts-ignore
                    .attr('width', Math.abs(cursorx1.node()?.getBBox().x - 1.5 - cursorx2.node()?.getBBox().x))
                })
                .on("end", ()=>{
                    cursorx1?.attr("stroke", "darkgrey");
                })
            )
            cursorx1.raise()
        }
    }
</script>
<div>
    <span class="label-text text-white">Horaires : </span>
    {#if showModal1 === true}
        <ModalTime bind:infoModal={infoModal1} bind:showModal={showModal1}/>
    {:else}
        <button on:click={()=>{showModal1=true}}>Choisir heure</button>
    {/if}
    <span class="label-text text-white">{infoModal1?.getTime()}</span>
    {#if showModal2 === true}
        <ModalTime bind:infoModal={infoModal2} bind:showModal={showModal2}/>
    {:else}
        <button on:click={()=>{showModal2=true}}>Choisir heure</button>
    {/if}
    <span class="label-text text-white">{infoModal2?.getTime()}</span>
    <div bind:this={time}>
    </div>
</div>