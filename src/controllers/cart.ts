import { Request, Response } from "express";
import { Product } from "../models/Product";
import express from "express";
import { authorize } from "./authorize";
import { count } from "console";
import process from "process";
import cookieParser from "cookie-parser";
/**
 * GET /
 * Home page.
 */

export const cartRouter = express.Router();
cartRouter.use(express.urlencoded({ extended: true }));
cartRouter.use(cookieParser(process.env.COOKIE_SECRET));


interface ProductWithCount {
    id: number;
    name: string;
    price: number;
    description: string;
    img_url: string;
    qt : number;
}
class ProductWithCount {
    public id : number;
    public name: string;
    public price: number;
    public description: string;
    public img_url: string;
}
function change(prod : Product, cnt : number) : ProductWithCount{
    const ret = new ProductWithCount();
    ret.id = prod.id;
    ret.name = prod.name;
    ret.price = prod.price;
    ret.img_url = prod.img_url;
    ret.qt = cnt;
    return ret;
}

cartRouter.get(
    "/",
    authorize("Admin", "Normal"),
    (req: Request, res: Response) => {
        (async function () {
            const products = [];
            const prod_cnt = {};
            if (req.signedCookies.cart) {
                const pom = req.signedCookies.cart;
                pom.map(Number);
                pom.sort((a : number, b : number)=>{
                    if(a < b) return -1;
                    if(a > b) return 1;
                    return 0;
                });
                let previous = -1;
                let cnt = 0;
                for (const prod_id of pom) {
                    if(prod_id != previous && previous != -1){
                        const prod = await Product.findById(previous);
                        if(prod) products.push(change(prod, cnt));
                        cnt = 0;
                    }
                    cnt++;
                    previous = prod_id;
                }
                if(previous != -1){
                    const prod = await Product.findById(previous);
                    if(prod) products.push(change(prod, cnt));
                }
            }
            let sum = 0;
            for(const x of products){
                sum += x.price*x.qt;
            }
            // products = await Product.getAll();
            res.render("cart", { products: products, sum : sum, url : "/cart", 
            cart_item_count : req.signedCookies.cart_item_count }); // user : req.user
        })();
    },
);
