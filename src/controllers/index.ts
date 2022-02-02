import { Request, Response } from "express";
import { Product } from "../models/Product";
import express from "express";
import { authorize } from "./authorize";
import { nextTick } from "process";

/**
 * GET /
 * Home page.
 */

export const indexRouter = express.Router();
var cookieParser = require("cookie-parser");
indexRouter.use(express.urlencoded({ extended: true }));
indexRouter.use(cookieParser("sgs90890s8g90as8rg90as8g9r8a0srg8"));

// TODO : remove express.js logic from controller to route handler
// TODO2 : maybe not
indexRouter.get("/", authorize("Normal", "Admin"), (req: Request, res: Response) => {
        (async function () {
            const products = await Product.getAll();
            res.render("index", {
                products: products,
                user: req.signedCookies.user,
            }); // user : req.user
        })();
    },
);

indexRouter.get("/annonymous", (req, res) => {
    (async function () {
        const products = await Product.getAll();
        res.render("index", { products: products }); // user : req.user
    })();
});

function assertGet(obj: any, prop: string): string {
    if (prop in obj) {
        return obj[prop];
    } else {
        throw new Error(`failed to get ${prop} on object`);
    }
}

indexRouter.post("/", authorize("Normal", "Admin"), (req: Request, res: Response) => {
    var addedProductId = req.body.button_id;
    if(addedProductId){
        var cur_cart = req.signedCookies.cart;
        if(!cur_cart) cur_cart = [];
        console.log(addedProductId);
        cur_cart.push(addedProductId);
        console.log(cur_cart);
        res.cookie("cart", cur_cart, {signed : true});
        res.redirect("/");
    }
});