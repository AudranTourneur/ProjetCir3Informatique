import mongoose from "mongoose";
import { roomSchema } from "./RoomSchema";

export const PlanSchema = new mongoose.Schema({
    name: String,
    imageId: String,     //mongodb _id
    isPublic: Boolean,
    rooms: [roomSchema],
    description: String
}, { collection: "plans" })