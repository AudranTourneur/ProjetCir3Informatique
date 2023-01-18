import  mongoose  from "mongoose"


export const pointsSchema=new mongoose.Schema({
    x:Number,
    y:Number
})