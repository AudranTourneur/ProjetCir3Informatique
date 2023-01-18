import { NumberExpression } from "mongoose"

export type Point = {
    x: number,
    y: number,
}

export type Room ={
    name: string,
    points: Array<Point>
    capacity: NumberExpression,
    hasProjector: boolean,
    whiteboard: boolean,
    blackboard: boolean,
    description: string,
}

export type Plan = {
    id: number,
    name: string,
    description: string,
    rooms: Array<Room>,
    isPublic: boolean,
}