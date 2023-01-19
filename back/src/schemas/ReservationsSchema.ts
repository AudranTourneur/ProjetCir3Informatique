import mongoose from "mongoose";

//Toutes les dates sont gerees avec les timestamp en milisecondes
export const reservationSchema = new mongoose.Schema({
    reservedBy:String,
    date:String,
    startTime:Number,
    endTime:Number,
    roomName:String,
    planId:String       //_id mongodb d'un plan
},{collection:"reservations"})