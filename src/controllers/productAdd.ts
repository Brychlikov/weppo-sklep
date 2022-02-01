import multer from "multer";
import { Request, Response } from "express";
import express from "express";
import path from "path";
import { Product } from "../models/Product";

function uniqueFilename() : string{
    return Date.now().toString() + Math.round(Math.random() * 1e7).toString();
}

function getExtension(fpath: string) : string {
    return path.extname(fpath);
}

// WARNING
// HERE LIES SOME VULTERABILITY
// admin can upload a malicious file looking like a png

const storage = multer.diskStorage ({
    destination: (req, file, cb) => { cb(null, './public/uploads'); },
    filename: (req, file, cb) => { cb(null, uniqueFilename() + getExtension(file.originalname));},
});

const upload = multer({ storage });

export const uploadRouter = express.Router();

function assertGet(obj: any, prop: string) {
    if(prop in obj) {
        return obj[prop];
    } else {
        throw new Error(`failed to get ${prop} on object`);
    }
}


declare module 'express-session' {
    interface SessionData {
        productName: string,
    }
}

uploadRouter.get('/add', (req: Request, res: Response) => {
    const productName = req.session.productName || "";
    res.render('add_product', { productName });
});

uploadRouter.post('/new', upload.single('productImage'), async (req: Request, res: Response) => {
    console.log(req.file);
    const prodData: any = {};
    prodData.name = assertGet(req.body, "name");
    prodData.price = assertGet(req.body, "price");
    prodData.description = assertGet(req.body, "description");
    const imgUrl = req.file?.path.substring(req.file?.path.indexOf('/'));
    prodData.img_url = imgUrl;
    const _p = await Product.createProduct(prodData);
    res.render('products/added');
});



