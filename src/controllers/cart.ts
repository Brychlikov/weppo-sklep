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
            const products = [];
            if (req.signedCookies.cart) {
                const pom = req.signedCookies.cart;
                pom.map(Number);
                pom.sort((a: number, b: number) => (a < b ? -1 : ((a > b) ? 1 : 0)));
                let previous = -1;
                let cnt = 0;
                for (const prod_id of pom) {
                    if(prod_id != previous && previous != -1){
                        const prod = await Product.findById(previous);
                        if(prod){
                            const prodWithCount = await ProductWithCount.changeFromProduct(prod, cnt);
                            products.push(prodWithCount);
                        }
                        cnt = 0;
                    }
                    cnt++;
                    previous = prod_id;
                }
                if(previous != -1){
                    const prod = await Product.findById(previous);
                    if(prod){
                        const prodWithCount = await ProductWithCount.changeFromProduct(prod, cnt);
                        products.push(prodWithCount);
                    }
                }
            }
            let sum = 0;
            for(const x of products){
                sum += x.price*x.qt;
            }
            // products = await Product.getAll();
            res.render("cart", { products: products, sum : sum, url : "/cart", 
            cart_item_count : req.signedCookies.cart_item_count,
            user : req.signedCookies.user }); // user : req.user
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

