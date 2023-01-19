import * as d3 from "d3";
import type { Writable } from "svelte/store";

export class Room {
    public polygon : undefined | d3.Selection<SVGPolygonElement, unknown, HTMLElement, any>;

    constructor(public points : number[][], public name : string, public capacity: number, public projecteur: boolean, private globalStore: Writable<Room | null>) {
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

    undraw() {
        this.polygon?.remove();
    }

    editPolygon() {
        let svg = d3.select("#main-svg");

        this.points.forEach(element => {
            let circle = svg.append("circle")
            .attr('points', this.points.toString())
            .attr('stroke', '#f00')
            .attr('fill', 'red')
            .attr("cx", element[0])
            .attr("cy", element[1])
            .attr("r", 3)
            // @ts-ignore
            .call(d3.drag()
                .on("start", ()=>{
                    d3.selectAll(circle).attr("stroke", "black");
                })
                .on("drag", (event)=>{
                    d3.selectAll(circle).attr("cx", event.x).attr("cy", event.y);

                    element[0]=event.x
                    element[1]=event.y

                    this.polygon?.attr("points",this.points.toString())
                })
                .on("end", ()=>{
                    d3.selectAll(circle).attr("stroke", "red");
                })
            )

        });
    }

    stopEditPolygon() {
        d3.selectAll("#main-svg > circle").remove();
    }
}