import mongoose from "mongoose";
import { pointsSchema } from "./PointsSchema";

export const roomSchema=new mongoose.Schema({
    name:String,
    points:[pointsSchema],
    capacity:Number,
    hasProjector:Boolean,
    hasWhiteboard:Boolean,
    hasBlackboard:Boolean,
    description:String
})