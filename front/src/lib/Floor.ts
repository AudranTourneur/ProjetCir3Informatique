import { Room } from "$lib/Room";
import * as d3 from 'd3';
import type { Writable } from "svelte/store";

type RoomData = {
    points: number[][],
    name: string,
    capacity: number,
    projecteur: boolean,
};

export class Floor {
    public rooms: Array<Room> = [];

    constructor(data : RoomData[], public name : string, private globalStore: Writable<Room | null>) {  
        data.forEach(element => {
            let tmp = new Room(element.points,element.name,element.capacity,element.projecteur, globalStore)
            this.rooms.push(tmp);
        });
        console.log(this.rooms);
    }

    update() {
        d3.selectAll("#main-svg > polygon").remove();
        this.rooms.forEach(element => {         
            element.draw();
        });
    }

    unDraw() {
        d3.selectAll("#main-svg > polygon").remove();
    }

    newRoom(data : RoomData) {
        this.rooms.push(new Room(data.points,data.name,data.capacity,data.projecteur, this.globalStore));
        this.unDraw();
        this.update();
    }

    delete(room : Room) {
        room.undraw()
        this.rooms = this.rooms.filter(e => e !== room)
        this.update();
    }

    reInitialyse() {
        this.rooms.forEach(element => {
            element.polygon!.attr('stroke', '#ff0');
        });
    }
}