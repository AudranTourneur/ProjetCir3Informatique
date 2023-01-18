import { Application } from "express";
import { Schema, model } from 'mongoose'
import multer from 'multer'
import * as Jimp from 'jimp'

import { imageSchema } from "../schemas/ImageSchem";
import * as db from './db'

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, });


const ImageModel = model('images', imageSchema);

export function initImagesApp(app: Application) {
    app.post('/upload', upload.single('image'), async (req, res) => {
        const file = req.file;
        if (!file) return;

        // Convert the file to a buffer and then to base64
        const fileBuffer = Buffer.from(file.buffer);
        const base64File = fileBuffer.toString('base64');

        const doc = new ImageModel({ image: { data: base64File, contentType: req.file?.mimetype ?? '' } });
        const docRes = await doc.save();

        console.log('File uploaded and converted to base64')
        res.send({ id: docRes._id });
    });

    app.get('/images/:image', async (req, res) => {

        const planId = req.params.image.split('.')[0];
        if (!planId) return res.send('Non existant image');

        const imageDoc = await ImageModel.findOne({ _id: planId }).lean().exec();
        if (!imageDoc || !imageDoc.image || !imageDoc.image.data) return res.send('Non existant image');
        const imageData = imageDoc.image.data;
       
        const img = Buffer.from(imageData, 'base64');
      
        if(req.query.miniature){
            console.log('bonjour miniature')
            const image = await Jimp.read(img);
            image.resize(300,300);

            image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': buffer.length
                });
                res.end(buffer)
            })
        }
        else {
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

import {z} from 'zod'

const planCreationRequestSchema = z.object({
    name: z.string(),
    imageId: z.string()
})

export async function uploadPlanData(data: any): Promise<string> {
    console.log('body=', data)
    const planCreationRequest = planCreationRequestSchema.parse(data)

    const plan = {
        name: planCreationRequest.name,
        imageId: planCreationRequest.imageId,
    }

    const planId = await db.createNewPlan(plan.imageId, plan.name, '');
    console.log('Uploaded plan ID', planId)
    return planId;
};

export async function getImagesList(res: any) {
    res.json((await db.getImagesList()).map(x => x._id));
}