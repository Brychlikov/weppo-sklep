import multer from "multer";
import { Request, Response } from "express";
import express from "express";


const upload = multer({ dest : './public/uploads' });

export const uploadRouter = express.Router();

function assertGet(obj: any, prop: string) {
    if(prop in obj) {
        return obj[prop];
    } else {
        throw new Error(`failed to get ${prop} on object`);
    }
}

uploadRouter.get('/add', (req: Request, res: Response) => {
    res.render('add_product');
});

uploadRouter.post('/new', upload.single('productImage'), (req: Request, res: Response) => {
    console.log(req.file);
    const prodData: any = {};
    prodData.name = assertGet(req.body, "name");
    prodData.price = assertGet(req.body, "price");
    prodData.description = assertGet(req.body, "description");
    res.render('products/added');
});



