import * as d3 from "d3";
import type { Writable } from "svelte/store";

export class Room {
    public polygon : undefined | d3.Selection<SVGPolygonElement, unknown, HTMLElement, any>;

    constructor(private points : number[][], public name : string, public capacity: number, public projecteur: boolean, private globalStore: Writable<Room | null>) {
    }

    draw() {
        let svg = d3.select("#main-svg");

        this.polygon = svg.append("polygon")
        .attr('points', this.points.toString())
        .attr('stroke', '#f00')
        .attr('fill', 'red')
        .style("fill-opacity", .2)
        .on("click", () => {
            d3.selectAll("#main-svg > polygon").attr('stroke', '#f00');
            this.polygon!.attr('stroke', '#ff0');
            this.globalStore.set(this)
        });
    }
    
    printRoom() {
        console.log(this.points);
    }


}