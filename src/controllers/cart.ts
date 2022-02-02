import { Request, Response } from "express";
import { Product } from "../models/Product";
import express from "express";
import { authorize } from "./authorize";
import { count } from "console";

/**
 * GET /
 * Home page.
 */

export const cartRouter = express.Router();
var cookieParser = require("cookie-parser");
cartRouter.use(express.urlencoded({ extended: true }));
cartRouter.use(cookieParser("sgs90890s8g90as8rg90as8g9r8a0srg8"));


interface ProductWithCount {
    id: number;
    name: string;
    price: number;
    description: string;
    img_url: string;
    qt : number;
}
class ProductWithCount {
    public id : number
    public name: string;
    public price: number;
    public description: string;
    public img_url: string;
}
function change(prod : Product, cnt : number) : ProductWithCount{
    var ret = new ProductWithCount();
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
            var products = [];
            let prod_cnt = {};
            if (req.signedCookies.cart) {
                var pom = req.signedCookies.cart;
                pom.map(Number);
                pom.sort((a : Number, b : Number)=>{
                    if(a < b) return -1;
                    if(a > b) return 1;
                    return 0;
                });
                var previous = -1;
                var cnt = 0;
                for (var prod_id of pom) {
                    if(prod_id != previous && previous != -1){
                        var prod = await Product.findById(previous);
                        if(prod) products.push(change(prod, cnt));
                    }
                    cnt++;
                    previous = prod_id;
                }
                if(previous != -1){
                    var prod = await Product.findById(previous);
                    if(prod) products.push(change(prod, cnt));
                }
            }
            // products = await Product.getAll();
            res.render("index", { products: products }); // user : req.user
        })();
    },
);
