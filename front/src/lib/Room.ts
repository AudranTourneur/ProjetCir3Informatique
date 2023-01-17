import * as d3 from "d3";

export class Room {
    public polygon : undefined | d3.Selection<SVGPolygonElement, unknown, HTMLElement, any>;

    constructor(private points : Number[][], public name : String, public capacity: Number, public projecteur: Boolean) {
    }

    draw() {
        let svg = d3.select("svg");

        this.polygon = svg.append("polygon")
        .attr('points', this.points.toString())
        .attr('stroke', '#f00')
        .attr('fill', 'red')
        .style("fill-opacity", .2)
        .on("click", () => {
            d3.selectAll("svg > *").remove();
            this.polygon!.attr('stroke', '#ff0');
        });
    }
    
    printRoom() {
        console.log(this.points);
    }


}