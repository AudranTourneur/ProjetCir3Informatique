import mongoose from 'mongoose'
import { boolean } from 'zod';
import {generateToken} from './token'
import { UserSchema } from '../schemas/UserSchema';
import { PlanSchema } from '../schemas/PlanSchema';
import { reservationSchema } from '../schemas/ReservationsSchema';
import { imageSchema } from '../schemas/ImageSchem';
import { Plan } from '../types';



const Users=mongoose.model('user',UserSchema);
const Plans=mongoose.model('plan',PlanSchema);
const Reservations=mongoose.model('reservations',reservationSchema);
const Images=mongoose.model('images',imageSchema);

mongoose.connection.on('connected',()=>console.log("connected to the mongo server"));
mongoose.connection.on('error', (err)=> console.log("Error:",err));
process.on('SIGINT',()=>{
	mongoose.connection.close(()=>{
		console.log('Mongoose conection closed');
		process.exit(0);
	})
})
//Pour enlever un warning de deprecation
mongoose.set('strictQuery',true);
export async function initDb(){
	await mongoose.connect('mongodb://127.0.0.1:27017/',{dbName:'app'}).catch((error)=>{
		console.log("Error :",error);
	})
	
}

export async function createNewUser(password:string,email:string,token:string){
	let user = new Users({
		password:password,
		email:email,
		token:token,
		admin:false
	});
	await user.save();
	console.log("New user added",user);
}

//Return true si l'email est utilise une seule fois false sinon
export async function emailExists(email:string){
	const result= await Users.find({email:email});
	if(!result){
		return false;
	}
	return result.length == 1;
}

//Return true si l'email existe et si le parametre password et le meme en bdd, ensuite met à jour le token, sinon renvoit false
export async function signIn(email:string,password:string,token:string){
	const query = await Users.find({email:email});
	if(!query[0]){
		return 'email';
	}else if(query[0].password==password){
		await setToken(email,token);
	} else {
		return 'password';
	}
	return 'success';
}

//Return true si le token en parametre est bien le meme en bdd, sinon false
export async function checkConnection(email:string,token:string){
	const result=await Users.find({email:email});
	if(!result[0]){
		return false;
	}
	return result[0].token == token;
}

export async function setToken(email:string,token:string){
	const result = await Users.findOneAndUpdate({email:email},{token:token},{new:true});
	if(!result){
		return false;
	}
	return result.token == token;
}

export async function resetPassword(email:string,password:string){
	const result = await Users.findOneAndUpdate({email:email},{password:password},{new:true});
	if(!result){
		return false;
	}
	return result.password == password;
}

export async function isAdmin(email:string){
	const result=await Users.findOne({email:email});
	if(!result){
		return false;
	}
	return result.admin;
}
//export function async getImageId(name:String){
//	const result =await Image.find({createdAt:},)
//}


export async function createNewPlan(imageId:String,name:String,description:String): Promise<string> {
	let plans=new Plans({
		name:name,
		imageId:imageId,
		isPublic:false,
		rooms:[],
		description:description
	})
	const dbResponse = await plans.save();
	//@ts-ignore
	return dbResponse._id;
}
//TODO need to finish
export async function updatePlan(planSchema:Plan){
	console.log('updating db with', planSchema)
	const result=await Plans.findByIdAndUpdate(planSchema._id,{name:planSchema.name,rooms:planSchema.rooms},{new:true});
	console.log("UPDATE PLAN :",result);
	if(!result){
		return false;
	}
	//Faut quand meme faire un check que les varaibles du type sont les meme du schema
	return true;
}

export async function getImagesList(){
	return await Images.find({},'_id');
	
}

export async function getAllPlans(){
	return await Plans.find({});
}

export async function getPlan(planId:String){
	return await Plans.findById(planId);
}


export async function getAllReservationsByEmail(email:String){
	const result= await Reservations.find({email:email});
	if(!result)return false;
	return result;
}


export async function getAllReservationsForPlanByDate(planId:String,date:Number){
	const result = await Reservations.find({planId:planId,date:date});
	if(!result)return false;
	return result;
}



//Deletes reservation if email in argument is the same as value in reservedBy
//Returns 1 if reservation succeded, 2 if no resevations found, 0 if nothing got deleted 
export async function deleteReservation(planId:String,roomName:String,startTime:Number,email:String){
	const result = await Reservations.findOne({planId:planId,roomName:roomName,startTime:startTime});
	if(result?.reservedBy==email){
		const success=await Reservations.deleteOne({_id:result._id});
		return  success;	//Renvoit nbre de documents supprimr
	}else return 2;
}

export async function deletePlan(_id:String){
	const nbPlansDelete=await Plans.deleteOne({_id:_id});
	const nbReservationsDelete=await Reservations.deleteMany({planId:_id});
	return {plansDeleted:nbPlansDelete,reservationsDeleted:nbReservationsDelete};
}




//attention mdp admin :1234
//email admin : Admin@chehpaul
//pour mettre en admin un utilisateur faire la commande db.user.findOneAndUpdate({email:"lucas@lucas.com"},{$set:{admin:true}}) dans mongosh
