import multer from "multer";
import { Request, Response } from "express";
import express from "express";
import path from "path";
import { Product } from "../models/Product";
import { authorize } from "./authorize";
import { body, validationResult } from "express-validator";
import session from "express-session";
import {User} from "../models/User";
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

interface ProductSession {
    name: string,
    price: string,
    description: string
    error: string | null
}

declare module 'express-session' {
    interface SessionData {
        productSession: ProductSession
    }
}

productsRouter.get('/add', authorize("Admin"), async (req: Request, res: Response) => {
    const name = req.session.productSession?.name;
    const price = req.session.productSession?.price;
    const description = req.session.productSession?.description;
    const error = req.session.productSession?.error;
    const user = await User.findByName(req.signedCookies.user);
    res.render('add_product', { name, price, description, error, user : user, url : "/products/add",
    cart_item_count : req.signedCookies.cart_item_count  });
});

productsRouter.post(
    '/new',
    authorize("Admin"),
    upload.single('productImage'), 
    body('name').notEmpty().withMessage("Nazwa nie może być pusta"),
    body('price').isNumeric().withMessage("Cena powinna być liczbą"),
    body('description').notEmpty().withMessage("Opis nie może być pusty"),
    async (req: Request, res: Response) => 
{
    const prodData: any = {};

    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    prodData.name = name;
    prodData.price = price;
    prodData.description = description;

    req.session.productSession = { name, price, description, error: null };

    const errors = validationResult(req);
    if (!errors.isEmpty() || req.file == null) {
        let message = "";
        for (const err of errors.array()) {
            message += `${err.msg}\n`;
        }

        if ( req.file == null) {
            message += "Obrazek jest wymagany";
        }

        req.session.productSession.error = message;
        req.session.save(err => {
            if (err) {
                console.log("error when writing to session", err);
            } else {
                res.redirect("add");
            }
        });
        return;
    }
    const imgUrl = req.file?.path.substring(req.file?.path.indexOf('/'));
    prodData.img_url = imgUrl;
    const _p = await Product.createProduct(prodData);
    const user = await User.findByName(req.signedCookies.user);
    res.redirect('/');
    // res.render('products/added', { user : user, url : "/products/new",
    // cart_item_count : req.signedCookies.cart_item_count });
});

productsRouter.get("/:id", async (req, res) => {
    const prod = await Product.findById(Number(req.params.id));
    if(req.signedCookies.user){
        const user = await User.findByName(req.signedCookies.user);
        res.render('product', { product : prod, user : user, url : `/product/${req.params.id}`,
        cart_item_count : req.signedCookies.cart_item_count });
    }else{
        res.render('product', { product : prod, url : `/product/${req.params.id}`,
        cart_item_count : req.signedCookies.cart_item_count });
    }
});


productsRouter.post("/:id", async (req, res) => {
    if (req.signedCookies.user) {
        const addedProductId = req.body.button_id;
        if (addedProductId) {
            res.cookie(
                "cart_item_count",
                Number(req.signedCookies.cart_item_count) + 1,
                { signed: true },
            );
            // console.log(Number(req.signedCookies.cart_item_count) + 1);
            let cur_cart = req.signedCookies.cart;
            if (!cur_cart) cur_cart = [];
            cur_cart.push(addedProductId);
            res.cookie("cart", cur_cart, { signed: true });
            res.redirect(`/products/${req.params.id}`);
        }
    } else {
        res.redirect("/login?message=Zaloguj się żeby dodawać do koszyka");
    }
});