import mongoose from "mongoose";

export const  UserSchema= new mongoose.Schema ({
	password:String,
	email:String,
	token:String,
	admin:Boolean
},{collection:"user"});
