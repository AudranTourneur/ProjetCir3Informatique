import type { Application } from "express";

import { Schema, model } from 'mongoose'
import multer from 'multer'

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, });

const imageSchema = new Schema({
    image: { data: String, contentType: String },
    floor: Number,
}, { timestamps: true });

const ImageModel = model('images', imageSchema);

export function initImagesApp(app: Application) {
    app.post('/upload', upload.single('image'), async (req, res) => {
        const file = req.file;
        if (!file) return;

        // Convert the file to a buffer and then to base64
        const fileBuffer = Buffer.from(file.buffer);
        const base64File = fileBuffer.toString('base64');

        // Do something with the base64 file
        console.log(base64File);


        const doc = new ImageModel({ image: { data: base64File, contentType: req.file?.mimetype ?? '' }, floor: id })
        await doc.save()
        console.log('File saved with ID', doc._id)


        res.send("File uploaded and converted to base64");
    });


    app.get('/images/:image', async (req, res) => {

        const floorId = req.params.image.split('.')[0]
        if (!floorId) return res.send('Non existant image');
        console.log('searching', floorId)

        const imageDoc = await ImageModel.findOne({ floor: Number(floorId) }).lean().exec();
        console.log('image=', imageDoc)
        if (!imageDoc || !imageDoc.image || !imageDoc.image.data) return res.send('Non existant image');
        const imageData = imageDoc.image.data

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
    return await ImageModel.countDocuments({});
}