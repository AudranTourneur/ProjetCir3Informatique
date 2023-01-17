import { Room } from "$lib/Room";
import d3 from "d3";

type RoomData = {
    points: Number[][],
    name: string,
    capacity: number,
    projecteur: boolean,
};

export class Floor {
    private rooms: Array<Room> = [];

    constructor(data : [RoomData], public name : String) {       
        data.forEach(element => {
            let tmp = new Room(element.points,element.name,element.capacity,element.projecteur)
            this.rooms.push(tmp);
        });
    }

    draw() {
        this.rooms.forEach(element => {         
            element.draw();
        });
    }

    unDraw() {
        d3.selectAll("svg > *").remove();
    }

    newRoom(data : RoomData) {      
        this.rooms.push(new Room(data.points,data.name,data.capacity,data.projecteur));
        this.unDraw();
        this.draw();
    }
    reInitialyse() {
        this.rooms.forEach(element => {
            element.polygon!.attr('stroke', '#ff0');
        });
    }
}