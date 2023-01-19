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
    if (true || (await db.checkConnection(email, token) && await db.isAdmin(email))) {
        console.log('1')
        if (await db.updatePlan(plan)) {
            console.log('2')
            res.json({status: 1});
        } else {
            console.log('3')
            res.json({status: 0});
        }
    } else {
        console.log('4')
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

export async function getAllReservationsForPlanByDate(planId: string, displayedDate: number, res: Response) {
    await res.json({data: await db.getAllReservationsForPlanByDate(planId, displayedDate)});
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
    let searchingDay = {day: new Date(startTime).getDate(), month: new Date(startTime).getMonth()+1, year: new Date(startTime).getFullYear()};
    let reservations = await db.getAllReservationsForPlanByDate(planId, searchingDay);
    //delete reservations that are not in the time interval
    // @ts-ignore
     reservations = reservations.filter(reservation => reservation.startTime < endTime && reservation.endTime > startTime);
     console.log('reservations', reservations);
     res.send('ok');
}

export async function bookRoom(planId: string, roomName: string, startTime: number, endTime: number, email: string, token: string, res: Response) {
    if (await db.checkConnection(email, token)) {
        await res.json({status: await db.bookRoom(planId, roomName, startTime, endTime, email)});
    } else {
        await res.json({status: 666});
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