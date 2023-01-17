export class Room {
    points: Array<Array<Number>>;
    capacite: Number;
    projecteur: Boolean;
    
    constructor(points) {
        this.points = points;
    }
    
    printRoom() {
        console.log(this.points);
    }
}