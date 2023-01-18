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
    hasWhiteboard: boolean,
    hasBlackboard: boolean,
    description: string,
}

export type Plan = {
    id: string,
    imageId:string,
    name: string,
    description: string,
    rooms: Array<Room>,
    isPublic: boolean,
}