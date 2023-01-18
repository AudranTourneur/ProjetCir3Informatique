import nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import {generateToken} from './token';
import * as db from './db';

//ash function for passwords
export const ash = (str: string) => crypto.createHash('sha256')
    .update(str, 'utf-8')
    .digest('hex');

//queue for reset password accounts
const resetPasswordQueue = new Array();

//url to send by email, replace it by domain name
const urlFront = 'http://localhost:8100/'; //URL DE DEV
//TODO change urlfornt to correct url of server

//init of the mail sender
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'noreply.tassadar.ovh@gmail.com',
        pass: 'duhdjbwxilbhiplw'
    }
});

//mail options of subject, text and receiver
const mailOptions = {
    from: 'noreply.tassadar.ovh@gmail.com',
    to: '',
    subject: '',
    text: ''
};

//clears resetPassword queue,
//single line including token if token or each line including email if email
export function clearResetPasswordQueue(token: string, email = '') {
    for (let i = 0; i < resetPasswordQueue.length; i++) {
        if (!email) {
            if (resetPasswordQueue[i].token === token) {
                resetPasswordQueue.splice(i, 1);
            }
        } else {
            if (resetPasswordQueue[i].email === email) {
                resetPasswordQueue.splice(i, 1);
            }
        }
    }
}

//asks if an account containing username or email is in db, priority to username
async function userExists(email: string) {
    if(email) {
        return Number(await db.emailExists(email));
    }else{
        return 2;
    }
}

export async function exitUserExists(email: string, res: any) {
    await res.json({status: await userExists(email)});
}

//creates the account with datas in the queue linked to token
export async function createAccount(email: string, password: string, res: any) {
    if(!await userExists(email)) {
        let token = generateToken();
        await db.createNewUser(ash(password), email, token)
        await res.json({status: 1, token});
        return 1;
    }else{
        res.json({status: 0});
        return 0;
    }
}

//signIn, identifier can be either username or email
export async function signIn(email: string, password: string, res: any) {
    let token = generateToken();
    let result = await db.signIn(email, ash(password), token);
    if (result === 'success') {
        await res.json({status: 1, token});
        return 1;
    } else if (result === 'password') { //PASSWORD ERROR
        await res.json({status: 2});
        return 2;
    } else if (result === 'email') { //EMAIL ERROR
        await res.json({status: 0});
        return 3;
    }
    return 1;
}

export async function setToken(email: string, res: any) {
    let token = generateToken();
    if (await db.setToken(email, token)) {
        await res.json({status: 1, token});
        return 1;
    } else {
        await res.json({status: 0});
        return 0;
    }
}

export async function checkConnection(email: string, token: string, res: any) {
    if (await db.checkConnection(email, token)) {
        await res.json({status: 1});
        return 1;
    } else {
        await res.json({status: 0});
        return 0;
    }
}

//sends an email containing a unique token to reset the password, effective for 5 minutes
//temporary linking the token and email in the resetPassword queue
export async function mailResetPassword(email: string, language: string, res: any) {
    if (await db.emailExists(email)) {
        //const dictionary = await import('../files/json/translation/' + language + '.json', {assert: {type: 'json'}});
        const token = generateToken();
        clearResetPasswordQueue('', email);
        resetPasswordQueue.push({token, email});
        setTimeout(clearResetPasswordQueue, 300000, token);
        mailOptions.to = email;
        //mailOptions.subject = dictionary.mail[8].data;
        //mailOptions.text = dictionary.mail[9].data
        mailOptions.text="Tough luck";
        mailOptions.subject ="Mr Beast winner !";
            + urlFront
            + 'reset-password?token='
            + token;
        transporter.sendMail(mailOptions, async function (error) {
            if (error) {
                await res.json({status: 0});
                return 0;
            } else {
                await res.json({status: 1});
                return 1;
            }
        });
    } else {
        await res.json({status: 0});
        return 0;
    }
}

//asks if token is in the resetPassword queue
export async function checkResetPasswordToken(token: string, res: any) {
    for (const line of resetPasswordQueue) {
        if (line.token === token) {
            await res.json({status: 1});
            return 1;
        }
    }
    await res.json({status: 0});
    return 0;
}

//resets the password of the account linked to the email, himself linked to the token
export async function resetPassword(token: string, password: string, res: any) {
    for (const line of resetPasswordQueue) {
        if (line.token === token) {
            if(await db.resetPassword(line.email, ash(password))) {
                clearResetPasswordQueue(token);
                await res.json({status: 1});
                return 1;
            }else{
                await res.json({status: 0});
                return 0;
            }
        }
    }
}