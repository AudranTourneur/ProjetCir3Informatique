import { Application } from "express";
import { Schema, model } from 'mongoose'
import multer from 'multer'

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

        const imageDoc = await ImageModel.findOne({ _id: Number(planId) }).lean().exec();
        if (!imageDoc || !imageDoc.image || !imageDoc.image.data) return res.send('Non existant image');
        const imageData = imageDoc.image.data;

        const img = Buffer.from(imageData, 'base64');

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img);
        return;
    });
}

export async function dbGetNumberOfFloors() {
    return ImageModel.countDocuments({});
}

export function uploadPlanData(data: any, res: any) {

    res.json({status: 1});
};

export async function getImagesList(res: any) {
    res.json({status: 1, data: await db.getImagesList()});
}