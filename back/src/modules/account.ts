import nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { generateToken } from './token';

//ash function for passwords
const ash = (str) => crypto.createHash('sha256')
    .update(str, 'utf-8')
    .digest('hex');

//queue for pending creation accounts
const creatingAccountQueue = [];

//queue for reset password accounts
const resetPasswordQueue = [];

//url to send by email, replace it by domain name
const urlFront = 'http://localhost:8100/'; //URL DE DEV

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


//clears creatingAccount queue,
//single line including token if token or each line including email if email
export function clearCreatingAccountQueue(token, email='') {
    for (let i = 0; i < creatingAccountQueue.length; i++) {
        if(!email) {
            if (creatingAccountQueue[i].token === token) {
                creatingAccountQueue.splice(i, 1);
            }
        }else{
            if (creatingAccountQueue[i].email === email) {
                creatingAccountQueue.splice(i, 1);
            }
        }
    }
}

//clears resetPassword queue,
//single line including token if token or each line including email if email
export function clearResetPasswordQueue(token, email='') {
    for (let i = 0; i < resetPasswordQueue.length; i++) {
        if(!email) {
            if (resetPasswordQueue[i].token === token) {
                resetPasswordQueue.splice(i, 1);
            }
        }else{
            if (resetPasswordQueue[i].email === email) {
                resetPasswordQueue.splice(i, 1);
            }
        }
    }
}

//asks if an account containing username or email is in db, priority to username
export async function userExists(username, email, language, con, res) {
    const dictionary = await import('../files/json/translation/' + language + '.json', {assert: {type: 'json'}});
    con.query('SELECT username FROM users WHERE username = ?', username, async (e, r) => {
        if (e) {
            throw e;
        } else {
            if (r.length) {
                await res.json({status: 0, message: dictionary.server[0].data});
            } else {
                con.query('SELECT username FROM users WHERE email = ?', email, async (er, re) => {
                    if (er) {
                        throw er;
                    } else {
                        if (re.length) {
                            await res.json({status: 0, message: dictionary.server[1].data});
                        } else {
                            await res.json({status: 1, message: ''});
                        }
                    }
                });
            }
        }
    });
}

//sends the creating account email, containing a unique token, effective for 5 minutes,
// temporary saving datas in the signUp queue
export async function mailCreateAccount(username, password, email, language, res) {
    const dictionary = await import('../files/json/translation/' + language + '.json', {assert: {type: 'json'}});
    const token = generateToken();
    clearCreatingAccountQueue('', email);
    creatingAccountQueue.push({token, username, password, email});
    setTimeout(clearCreatingAccountQueue, 300000, token);

    mailOptions.to = email;
    mailOptions.subject = dictionary.mail[0].data;
    mailOptions.text = dictionary.mail[1].data.replace('username', username)
        + urlFront
        + 'conf-account?token='
        + token;

    transporter.sendMail(mailOptions, async function (error) {
        if (error) {
            await res.json({status: 0, message: dictionary.mail[2].data});
        } else {
            await res.json({status: 1, message: dictionary.mail[3].data});
        }
    });
}

//asks if token is in the signUp queue
export async function checkSignUpToken(token, language, res) {
    const dictionary = await import('../files/json/translation/' + language + '.json', {assert: {type: 'json'}});
    for (const line of creatingAccountQueue) {
        if (line.token === token) {
            await res.json({status: 1, message: dictionary.mail[4].data});
            return 1;
        }
    }
    await res.json({status: 0, message: dictionary.mail[5].data});
    return 0;
}

//creates the account with datas in the queue linked to token
export function createAccount(token, language, con, res){
    for(const line of creatingAccountQueue){
        if(line.token===token){
            let token = generateToken();
            con.query('INSERT INTO users (username, password, email, token) VALUES (?,?,?)', [line.username, ash(line.password), line.email, token], async (err) => {
                if(err){
                    throw err;
                }else{
                    const dictionary = await import('../files/json/translation/' + language + '.json', {assert: {type: 'json'}});
                    const username = line.username;
                    clearCreatingAccountQueue(line.token);
                    await res.json({status: 1, message: dictionary.server[2].data, username: username, token});
                }
            });
            break;
        }
    }
}

//signIn, identifier can be either username or email
export function signIn(identifier, password, language, con, res) {
    con.query('SELECT username FROM users WHERE (username = ? OR email = ?)', [identifier, identifier], async (e,r)=> {
        if(e){
            throw e;
        }else{
            const dictionary = await import('../files/json/translation/' + language + '.json', {assert: {type: 'json'}});
            if(!r.length){
                await res.json({status: 0, message: dictionary.mail[6].data});
            }else{
                con.query('SELECT username FROM users WHERE (username = ? OR email = ?) AND password = ?', [identifier, identifier, ash(password)], async (er,re)=>{
                    if(er){
                        throw er;
                    }else{
                        if(re.length){
                            let token = generateToken();
                            con.query('UPDATE users SET token = ? WHERE username = ?', [token, re[0].username], async (err, result)=>{
                                if(err){
                                    throw err;
                                }else{
                                    await res.json({status: 1, message: '', username: re[0].username, token});
                                }
                            });
                        }else{
                            await res.json({status: 0, message: dictionary.mail[7].data});
                        }
                    }
                });
            }
        }
    });
}

export function getConnectionToken(username, con, res){
    let token = generateToken();
    con.query('UPDATE users SET token = ? WHERE username = ?', [token, username], async (error)=>{
        if(error) {
            throw error;
        }else{
            await res.json({status: 1, token});
        }
    });
}

export function checkConnection(username, token, con, res){
    con.query('SELECT username FROM users WHERE username = ? AND token = ?', [username, token], async (error, result)=>{
        if(error){
            throw error;
        }else{
            if(result.length){
                await res.json({status: 1});
            }else{
                await res.json({status: 0});
            }
        }
    });
}

//sends an email containing a unique token to reset the password, effective for 5 minutes
//temporary linking the token and email in the resetPassword queue
export function mailResetPassword(email, language, con, res){
    con.query('SELECT email FROM users WHERE email = ?', email, async (e, r) => {
        if(e){
            throw e;
        }else{
            const dictionary = await import('../files/json/translation/' + language + '.json', {assert: {type: 'json'}});
            if(r.length){
                const token = generateToken();
                clearResetPasswordQueue('', email);
                resetPasswordQueue.push({token, email});
                setTimeout(clearResetPasswordQueue, 300000, token);
                mailOptions.to=email;
                mailOptions.subject=dictionary.mail[8].data;
                mailOptions.text = dictionary.mail[9].data
                    + urlFront
                    + 'reset-password?token='
                    + token;
                transporter.sendMail(mailOptions, async function (error) {
                    if (error) {
                        await res.json({status: 0, message: dictionary.mail[2].data});
                    } else {
                        await res.json({status: 1, message: dictionary.mail[10].data});
                    }
                });
            }else{
                await res.json({status: 1, message: dictionary.mail[10].data});
            }
        }
    });
}

//asks if token is in the resetPassword queue
export async function checkResetPasswordToken(token, language, res) {
    const dictionary = await import('../files/json/translation/' + language + '.json', {assert: {type: 'json'}});
    for (const line of resetPasswordQueue) {
        if (line.token === token) {
            await res.json({status: 1, message: dictionary.mail[4].data});
            return 1;
        }
    }
    await res.json({status: 0, message: dictionary.mail[5].data});
    return 0;
}

//resets the password of the account linked to the email, himself linked to the token
export function resetPassword(token, password, language, con, res){
    for(const line of resetPasswordQueue) {
        if (line.token === token) {
            con.query('UPDATE users SET password = ? WHERE email = ?', [ash(password), line.email], async (err) => {
                if (err) {
                    throw err;
                } else {
                    const dictionary = await import('../files/json/translation/' + language + '.json', {assert: {type: 'json'}});
                    clearResetPasswordQueue(token);
                    await res.json({status: 1, message: dictionary.mail[11].data});
                    return 1;
                }
            });
        }
    }
}