import mongoose from "mongoose";

export const imageSchema = new mongoose.Schema({
    image: { data: String, contentType: String },
    floor: Number,
}, { timestamps: true });