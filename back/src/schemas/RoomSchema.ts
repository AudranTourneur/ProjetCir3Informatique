import mongoose from "mongoose";
import { pointsSchema } from "./PointsSchema";

export const roomSchema=new mongoose.Schema({
    points:[pointsSchema],
    capacity:Number,
    hasProjecteur:Boolean,
    hasWhiteboard:Boolean,
    hasBlackboard:Boolean,
    description:String
})