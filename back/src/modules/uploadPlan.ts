import { Application } from "express";
import { Schema, model } from 'mongoose'
import multer from 'multer'
import { imageSchema } from "../schemas/ImageSchem";

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

        const doc = new ImageModel({ image: { data: base64File, contentType: req.file?.mimetype ?? '' }});
        await doc.save();
        res.send("File uploaded and converted to base64");
    });

    app.get('/images/:image', async (req, res) => {

        const floorId = req.params.image.split('.')[0];
        if (!floorId) return res.send('Non existant image');

        const imageDoc = await ImageModel.findOne({ floor: Number(floorId) }).lean().exec();
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

};