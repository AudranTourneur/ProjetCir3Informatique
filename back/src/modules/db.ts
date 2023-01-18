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
const Images=mongoose.model('images',imageSchema)

mongoose.connection.on('connected',()=>console.log("connected to the mongo server"))
mongoose.connection.on('error', (error)=> console.log("Error:",error))

//Pour enlever un warning de deprecation
mongoose.set('strictQuery',true);
export function initDb(){
	mongoose.connect(process.env.MONGODB_STRING,{dbName:'app'})
	
}

export function createNewUser(password:string,email:string,token:string){
	let user = new Users({
		password:password,
		email:email,
		token:token,
		admin:false
	})
	user.save()
	console.log("New user added",user)
}

//Return true si l'email est utilise une seule fois false sinon
export async function emailExists(email:string){
	const result= await Users.find({email:email})
	if(!result)return false
	return result.length==1 ? true :false;
}

//Return true si l'email existe et si le parametre password et le meme en bdd, ensuite met à jour le token, sinon renvoit false
export async function signIn(email:string,password:string,token:string){
	const query = await Users.find({email:email})
	if(!query[0])return 'email'
	if(query[0].password==password){
		await setToken(email,token)
	}
	else return 'password'
	return 'success'
}

//Return true si le token en parametre est bien le meme en bdd, sinon false
export async function checkConnection(email:string,token:string){
	const result=await Users.find({email:email})
	if(!result[0])return false
	return result[0].token==token ? true:false;
	
}

export async function setToken(email:string,token:string){
	const result = await Users.findOneAndUpdate({email:email},{token:token},{new:true})
	if(!result)return false
	return result.token==token ? true : false
}

export async function resetPassword(email:string,password:string){
	const result = await Users.findOneAndUpdate({email:email},{password:password},{new:true})
	if(!result)return false
	return result.password==password ? true : false
}

export async function isAdmin(email:string){
	const result=await Users.findOne({email:email});
	if(!result)return 'email not found';
	return result.admin;
}
//export function async getImageId(name:String){
//	const result =await Image.find({createdAt:},)
//}


export function createNewPlan(imageId:String,name:String,description:String){
	let plans=new Plans({
		name:name,
		imageId:imageId,
		isPublic:false,
		rooms:[],
		description:description
	})
	plans.save();
}

export async function updatePlan(planSchema:Plan){
	const result=await Plans.findByIdAndUpdate(planSchema.id,{name:planSchema.name},{new:true});
	if(!result){
		return false;
	}
	//Faut quand meme faire un check que les varaibles du type sont les meme du schema
	return true;
}


//attention mdp admin :1234
//email admin : Admin@chehpaul
//pour mettre en admin un utilisateur faire la commande db.user.findOneAndUpdate({email:"lucas@lucas.com"},{$set:{admin:true}}) dans mongosh
