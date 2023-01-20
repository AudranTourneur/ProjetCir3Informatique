import {Application, Response} from "express";
import {Schema, model} from 'mongoose'
import multer from 'multer'
import * as Jimp from 'jimp'
import {z} from 'zod';
import {PlanSchema} from '../schemas/PlanSchema';
import {Plan} from '../types';

import {imageSchema} from "../schemas/ImageSchem";
import * as db from './db'

const multerStorage = multer.memoryStorage();
const upload = multer({storage: multerStorage,});


const ImageModel = model('images', imageSchema);

export function initImagesApp(app: Application) {
    app.post('/upload', upload.single('image'), async (req, res) => {
        const file = req.file;
        if (!file) return;

        // Convert the file to a buffer and then to base64
        const fileBuffer = Buffer.from(file.buffer);
        const base64File = fileBuffer.toString('base64');

        const doc = new ImageModel({image: {data: base64File, contentType: req.file?.mimetype ?? ''}});
        const docRes = await doc.save();

        console.log('File uploaded and converted to base64')
        res.send({id: docRes._id});
    });

    app.get('/images/:image', async (req, res) => {

        const planId = req.params.image.split('.')[0];
        if (!planId) return res.send('Non existant image');

        const imageDoc = await ImageModel.findOne({_id: planId}).lean().exec();
        if (!imageDoc || !imageDoc.image || !imageDoc.image.data) return res.send('Non existant image');
        const imageData = imageDoc.image.data;

        const img = Buffer.from(imageData, 'base64');

        if (req.query.miniature) {
            console.log('bonjour miniature')
            const image = await Jimp.read(img);
            image.resize(300, 300);

            image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': buffer.length
                });
                res.end(buffer)
            })
        } else {
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img);
        }
    });
}

export async function dbGetNumberOfFloors() {
    return ImageModel.countDocuments({});
}

const planCreationRequestSchema = z.object({
    name: z.string(),
    imageId: z.string()
});

export async function uploadPlanData(data: any): Promise<string> {
    console.log('body=', data)
    const plan = planCreationRequestSchema.parse(data)

    const planId = await db.createNewPlan(plan.imageId, plan.name, '');
    console.log('Uploaded plan ID', planId)
    return planId;
};

export async function getImagesList(res: Response) {
    res.json((await db.getImagesList()).map(x => x._id));
}

export async function getAllPlans(res: Response) {
    res.json({data: await db.getAllPlans()});
}

// A TESTER PAS SUR SUR QUE CA MARCHE
export async function updatePlan(email: string, token: string, plan: Plan, res: Response) {
    if (await db.checkConnection(email, token) && await db.isAdmin(email)) {
        if (await db.updatePlan(plan)) {
            res.json({status: 1});
        } else {
            res.json({status: 0});
        }
    } else {
        res.json({status: 666});
    }
    console.log('5')
}

export async function deletePlan(email: string, token: string, planId: string, res: Response) {
    if (await db.checkConnection(email, token) && await db.isAdmin(email)) {
        if (await db.deletePlan(planId)) {
            await res.json({status: 1});
        } else {
            await res.json({status: 0});
        }
    } else {
        await res.json({status: 666});
    }
}

export async function isAdmin(email: string, token: string, res: Response) {
    if (await db.isAdmin(email) && await db.checkConnection(email, token)) {
        await res.json({status: 1});
    } else {
        await res.json({status: 0});
    }
}

export async function getAllReservationsForPlan(planId: string, res: Response) {
    res.json({data: await db.getAllReservationsForPlan(planId)});
}

function getColorByCoeff(coeff: number){
    if (coeff ===0) {
        return 'green';
    } else if (coeff < 0.3) {
        return 'orange';
    } else {
        return 'red';
    }
}
 export async function getCoeffSupperpositionByRoomByHour(planId: string, startTime: number, endTime: number, res: Response) {
    // let searchingDay = new Date(startTime).getTime();
    // let reservations = await db.getAllReservationsForPlanByDate(planId, searchingDay);
    //  // @ts-ignore
    //  reservations = reservations.filter(reservation => reservation.startTime < endTime && reservation.endTime > startTime);

     res.send('ok');
}

async function canBookRoom(planId: string, room: string, startTime: number, date: string, endTime: number) {
    const planReservations = await db.getAllReservationsForPlan(planId);
    const dateAndRoomReservations = planReservations.filter(reservation =>  reservation.date === date && reservation.roomName === room);

    let canBook = true;
    for (const reservation of dateAndRoomReservations) {//Inshallah ça marche mashallah
        if (!reservation || !reservation.startTime || !reservation.endTime) {
            console.log('pas censé arriver')
            continue;
        }
        let case1 = reservation.endTime>startTime && reservation.endTime<endTime;
        let case2 = reservation.startTime>startTime && reservation.startTime<endTime;
        if(case1 && !case2){
            console.log('échec cas 1')
            canBook = false;
        }else if (!case1 && case2){
            console.log('échec cas 2')
            canBook = false;
        }else if (case1 && case2){
            console.log('échec cas 3')
            canBook = false;
        }
    }
    return canBook;
}

export async function bookRoom(planId: string, roomName: string, startTime: number, endTime: number,date: string, email: string, token: string, res: Response) {
    if (await db.checkConnection(email, token)) {
        if(startTime>endTime){ // swap si inversé
            let tmp = startTime;
            startTime = endTime;
            endTime = tmp;
        }
        if(await canBookRoom(planId, roomName, startTime, date, endTime)) {
            console.log('ouais on peut')
            res.json({status: await db.bookRoom(email, date, planId, roomName, startTime, endTime)});
        }else{
            console.log('nan')
            res.json({status: 0});
        }
    } else {
        console.log('auth refusé')
        res.json({status: 666});
    }
}

export async function myReservations(email: string, token: string, res: Response) {
    if (await db.checkConnection(email, token)) {
        await res.json({data: await db.getAllReservationsByEmail(email)});
    } else {
        await res.json({status: 666});
    }
}

export async function deleteReservation(planId: string, startTime: number, roomName: string, email: string, token: string, res: Response) {
    if (await db.checkConnection(email, token)) {
        await res.json({status: await db.deleteReservation(planId, roomName, startTime, email)});
    } else {
        await res.json({status: 666});
    }
}

export async function getPlan(planId: string, res: Response) {
    await res.json(await db.getPlan(planId));
}