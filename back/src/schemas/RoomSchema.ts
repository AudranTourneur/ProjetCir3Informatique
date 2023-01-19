import mongoose from "mongoose";

export const roomSchema=new mongoose.Schema({
    name:String,
    points: [{
        x: Number,
        y: Number,
    }],
    capacity:Number,
    hasProjector:Boolean,
    hasWhiteboard:Boolean,
    hasBlackboard:Boolean,
    description:String
},{collection:"rooms"})