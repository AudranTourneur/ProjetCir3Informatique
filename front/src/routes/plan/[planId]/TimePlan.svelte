<script lang="ts">
    import { onMount } from 'svelte';
    import ModalTime from './ModalTime.svelte'
    import * as d3 from 'd3';
	import { PUBLIC_API_HOST } from '$env/static/public';
	import type { Plan } from '$lib/types';


    export let reservations: Array<any>

    export let infoDate;

    $: {
        console.log('modif infoDate', infoDate)
    }

    let time : HTMLDivElement;
    let width = window.innerWidth;
    let height = 96;

    let cursorx1 : d3.Selection<SVGRectElement, unknown, null, undefined> | null = null;
    let cursorx2 : d3.Selection<SVGRectElement, unknown, null, undefined> | null = null;

    let numberX1: number = 0;
    let numberX2: number = 0;

    let reservation : d3.Selection<SVGRectElement, unknown, null, undefined> | null = null;
    let line : d3.Selection<SVGRectElement, unknown, null, undefined> | null = null;
    let svg : d3.Selection<SVGGElement, unknown, null, undefined> | null = null;

    export let selectedDate1 = new Date(infoDate.year,infoDate.month,infoDate.day);
    export let selectedDate2 = new Date(infoDate.year,infoDate.month,infoDate.day);
    export let dataDay;

    let showModal1 = false;
    let showModal2 = false;

    const offsetX = 8
    const offsetY = 9

    const cursorWidth = 5

    onMount(() => {
        svg = d3.select(time)
        .append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")

        // green
        svg.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', width)
            .attr('height', height-4)
            .attr('stroke', 'black')
            .attr('fill', 'lightgreen');

        let x = d3.scaleLinear()
            .domain([8, 20])
            .range([ 0, width - 2 * offsetX ]);

        svg.append("g")
            .attr("transform", "translate(8,"+(height-24)+")")
            .call(d3.axisBottom(x));


        svg.append('rect')
            .attr('x', offsetX)
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
                    .attr('x', getNearest(pointer[0])-(cursorWidth/2))
                    .attr('y', 9)
                    .attr('width', cursorWidth)
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


            for (const reservation of reservations) {
                const startDate = new Date(reservation.startTime);
                const endDate = new Date(reservation.endTime);

                createRect(startDate.getHours(), startDate.getMinutes(), endDate.getHours(), endDate.getMinutes());
            }
    })

    function getNearest(x : number) {
        let ratio = (x-8)/(width - 16);
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

    function createRect(hourA: number, minuteA: number, hourB: number, minuteB: number) {
        const xA = getXFromHourMin(hourA, minuteA);
        const xB = getXFromHourMin(hourB, minuteB);

        svg.append('rect')
            .attr('x', xA)
            .attr('y', offsetY)
            .attr('width', xB-xA)
            .attr('height', height-32)
            .attr('stroke', 'black')
            .attr('fill', 'red');
    }


    function getHourMin(x : number) {
        let tab : number[] = [];
        
        for(let i = 0; i < width; i++) {
            if(tab[tab.length-1]!=getNearest(i)) {
                tab.push(getNearest(i));
            }
        }

        let min = 0;
        let hour = 8;
        let i = 0;
        while(tab[i]<x){
            min+=15;
            if(min===60){
                hour++;
                min=0;
            }
            i++
        }

        let value = {"min" : min, "hour" : hour};

        return value
    }

    function getXFromHourMin(hour: number, minute: number): number {
        const startHour = 8;
        const endHour = 20;

        const rangeHour = endHour - startHour;

        const desiredHour = hour + minute / 60;

        const normalizedRatio = (desiredHour - startHour) / rangeHour;

        const rangePixel = width - 2 * offsetX;
        const value = normalizedRatio * rangePixel + offsetX;
        return value
    }

    function handleRect(event : any) {
        let pointer = d3.pointer(event);
        if(cursorx1 && !cursorx2) {
            line?.remove();

            let hourMin = getHourMin(getNearest(pointer[0]));
            selectedDate2 = new Date(infoDate.year, infoDate.month, infoDate.day, hourMin.hour, hourMin.min);

            cursorx2 = svg!.append('rect')
            .attr('x', getNearest(pointer[0]) - cursorWidth/2)
            .attr('y', 9)
            .attr('width', cursorWidth)
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
                    let hourmin = getHourMin(getNearest(event.x));
                    selectedDate2 = new Date(infoDate.year, infoDate.month, infoDate.day, hourmin.hour, hourmin.min);

                    cursorx2?.attr("x", getNearest(event.x))
                    //@ts-ignore
                    reservation.attr('x', Math.min(cursorx1.node()?.getBBox().x, cursorx2.node()?.getBBox().x))
                    //@ts-ignore
                    .attr('width', Math.abs(cursorx1.node()?.getBBox().x - 1.5 - cursorx2.node()?.getBBox().x));

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
            let hourMin = getHourMin(getNearest(pointer[0]));
            selectedDate1 = new Date(infoDate.year, infoDate.month, infoDate.day, hourMin.hour, hourMin.min);

            cursorx1 = svg!.append('rect')
            .attr('x', getNearest(pointer[0]) - cursorWidth/2)
            .attr('y', 9)
            .attr('width', cursorWidth)
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
                    let hourmin = getHourMin(getNearest(event.x));
                    selectedDate1 = new Date(infoDate.year, infoDate.month, infoDate.day, hourmin.hour, hourmin.min);

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

        checkIsReservationPossible();
    }

    function checkIsReservationPossible(date1: Date, date2: Date): boolean {

        if (!cursorx1 || !cursorx2) {
            return false
        }

        //console.log('x1', cursorx1)
        //console.log('x2', cursorx2)
        console.log(selectedDate1, selectedDate2)

        //let ts1 = selectedDate1.getTime();
        //let ts2 = selectedDate2.getTime();

        let ts1 = date1.getTime();
        let ts2 = date2.getTime();

        if (ts2 < ts1) {
            let tmp = ts1;
            ts1 = ts2;
            ts2 = tmp;
        }

        const startTime = ts1;
        const endTime = ts2;

        console.log('candidate', startTime, endTime)

        if (startTime === endTime) {
            return false
        }


        let canBook = true;
        for (const reservation of reservations) {
            console.log('reservation', reservation.startTime, reservation.endTime)
            let case1 = reservation.endTime>startTime && reservation.endTime<endTime;
            let case2 = reservation.startTime>startTime && reservation.startTime<endTime;
            if(case1 && !case2){
                return false
            }else if (!case1 && case2){
                return false
            }else if (case1 && case2){
                return false
            }

            if (reservation.endTime === startTime && reservation.startTime === endTime) {
                return false
            }
        }

        return canBook
    }

    export let isReservationPossible: boolean
    $: isReservationPossible = checkIsReservationPossible(selectedDate1, selectedDate2)

</script>

<div>
    <span class="label-text text-white">Horaires : </span>
    <div class="flex justify-evenly">
        <div class="flex flex-col items-center">
            <span class="text-white">Heure de début</span>    
            {#if (selectedDate1.getHours()+(selectedDate1.getMinutes()/60))<(selectedDate2.getHours()+(selectedDate2.getMinutes()/60))}
                <span class="label-text text-white">{selectedDate1.getHours()}:{selectedDate1.getMinutes()}</span>
            {:else}
                <span class="label-text text-white">{selectedDate2.getHours()}:{selectedDate2.getMinutes()}</span>
            {/if}
        </div>

   

        <div class="flex flex-col items-center">
            <div class="text-white">Heure de fin</div>
            {#if (selectedDate1.getHours()+(selectedDate1.getMinutes()/60))<(selectedDate2.getHours()+(selectedDate2.getMinutes()/60))}
                <span class="label-text text-white">{selectedDate2.getHours()}:{selectedDate2.getMinutes()}</span>
            {:else}
                <span class="label-text text-white">{selectedDate1.getHours()}:{selectedDate1.getMinutes()}</span>
            {/if}
        </div>
    </div>

    <div bind:this={time} />
</div>