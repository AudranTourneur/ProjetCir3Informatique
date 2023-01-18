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
    id: string,
    imageId: string,
    name: string,
    description: string,
    rooms: Array<Room>,
    isPublic: boolean,
}

import { z } from "zod";

// creating a schema for strings
export const planSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    imageId: z.string(),
    rooms: z.array(z.object({
        name: z.string(),
        points: z.array(z.object({  
            x: z.number(),
            y: z.number(),
        })),
        capacity: z.number(),
        hasProjector: z.boolean(),
        hasWhiteboard: z.boolean(),
        hasBlackboard: z.boolean(),
        description: z.string(),
    })),
    isPublic: z.boolean(),
});
