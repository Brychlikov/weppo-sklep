import multer from "multer";
import { Request, Response } from "express";
import express from "express";
import path from "path";
import { Product } from "../models/Product";
import { authorize } from "./authorize";
import { body, validationResult } from "express-validator";

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

export const productsRouter = express.Router();

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
        productPrice: number,
    }
}

productsRouter.get('/add', authorize("Admin"), (req: Request, res: Response) => {
    res.render('add_product', { user : req.signedCookies.user, url : "/products/add",
    cart_item_count : req.signedCookies.cart_item_count });
});

productsRouter.post(
    '/new',
    authorize("Admin"),
    upload.single('productImage'), 
    body('price').isNumeric(),
    async (req: Request, res: Response) => 
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('add');
        return;
    }
    console.log(req.file);
    const prodData: any = {};
    prodData.name = assertGet(req.body, "name");
    prodData.price = assertGet(req.body, "price");
    prodData.description = assertGet(req.body, "description");
    const imgUrl = req.file?.path.substring(req.file?.path.indexOf('/'));
    prodData.img_url = imgUrl;
    const _p = await Product.createProduct(prodData);
    res.render('products/added', { user : req.signedCookies.user, url : "/products/new",
    cart_item_count : req.signedCookies.cart_item_count });
});

productsRouter.get("/:id", (req, res) => {
    (async function () {
        const prod = await Product.findById(Number(req.params.id));
        if(req.signedCookies.user){
            res.render('product', { product : prod, user : req.signedCookies.user, url : `/product/${req.params.id}`,
            cart_item_count : req.signedCookies.cart_item_count });
        }else{
            res.render('product', { product : prod, url : `/product/${req.params.id}`,
            cart_item_count : req.signedCookies.cart_item_count });
        }
    })();
});
