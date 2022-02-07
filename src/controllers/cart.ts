import { Request, Response } from "express";
import { Product } from "../models/Product";
import express from "express";
import { authorize } from "./authorize";
import { count } from "console";
import process from "process";
import cookieParser from "cookie-parser";
import { sign } from "crypto";
import { userRouter } from "./login";
import { ProductWithCount } from "../models/ProductWithCount";
import { User } from "../models/User";
/**
 * GET /
 * Home page.
 */

export const cartRouter = express.Router();
cartRouter.use(express.urlencoded({ extended: true }));
cartRouter.use(cookieParser(process.env.COOKIE_SECRET));

cartRouter.get(
    "/",
    authorize("Admin", "Normal"),
    (req: Request, res: Response) => {
        (async function () {
            let products : ProductWithCount[];
            products = [];
            let sum = 0;
            if(req.signedCookies.cart_item_count != 0){ 
                products = await ProductWithCount.changeFromProductsId(req.signedCookies.cart);
                sum = ProductWithCount.getCostOfAllProducts(products);
            }
            const user = await User.findByName(req.signedCookies.user);
            res.render("cart", {
                products: products, sum: sum, url: "/cart",
                cart_item_count: req.signedCookies.cart_item_count,
                user: user,
            });
        })();
    },
);

cartRouter.post("/", authorize("Normal", "Admin"), (req : Request, res : Response) => {
    const deletedProductId = req.body.remove_button_id;
    console.log(deletedProductId);
    if(deletedProductId){
        let cnt = 0;
        const cur_cart = [];
        for(const prod of req.signedCookies.cart){
            if(prod == deletedProductId) cnt++;
            else cur_cart.push(prod);
        }
        res.cookie("cart_item_count", Number(req.signedCookies.cart_item_count) - cnt, { signed : true });
        res.cookie("cart", cur_cart, { signed : true });
    }
    res.redirect("/cart");
});

