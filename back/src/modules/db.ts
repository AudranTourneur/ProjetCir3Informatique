import mongoose from 'mongoose'
import { boolean } from 'zod';
import {generateToken} from './token'
import { UserSchema } from '../schemas/UserSchema';


const Users=mongoose.model('user',UserSchema);

mongoose.connection.on('connected',()=>console.log("connected to the mongo server"));
mongoose.connection.on('error', (error)=> console.log("Error:",error));

//Pour enlever un warning de deprecation
mongoose.set('strictQuery',true);
export async function initDb(){
	await mongoose.connect('mongodb://Admin:Admin123@10.224.1.172:27017/?authMechanism=DEFAULT',{dbName:'app'});
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
		return 'email not found';
	}
	return result.admin;
}

//attention mdp admin :1234
//email admin : Admin@chehpaul
//pour mettre en admin un utilisateur faire la commande db.user.findOneAndUpdate({email:"lucas@lucas.com"},{$set:{admin:true}}) dans mongosh
