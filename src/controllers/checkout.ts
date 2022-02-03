import { Request, Response } from "express";
import express from "express";
import { ProductWithCount } from "../models/ProductWithCount";
import { Product } from "../models/Product";

export const checkoutRouter = express.Router();

checkoutRouter.get("/", (req: Request, res: Response) => {
    res.render("checkout.ejs", {
        user: req.signedCookies.user,
        url: "/checkout",
        cart_item_count: req.signedCookies.cart_item_count,
    });
});

checkoutRouter.post("/", async (req: Request, res: Response) => {

    const [name, family_name, address_line1, address_line2, city, postal_code, phone] = 
    [req.body.given_name, req.body.family_name, req.body["address-line1"], req.body["address-line2"], req.body.city, 
    req.body["postal-code"], req.body.phone];
    const terms = req.body.terms ? 1 : 0;
    const terms2 = req.body.terms2 ? 1 : 0;
    const errors = 0;
    if(errors){

    }

    const products = [];
    if (req.signedCookies.cart) {
        const pom = req.signedCookies.cart;
        pom.map(Number);
        pom.sort((a: number, b: number) => (a < b ? -1 : ((a > b) ? 1 : 0)));
        let previous = -1;
        let cnt = 0;
        for (const prod_id of pom) {
            if (prod_id != previous && previous != -1) {
                const prod = await Product.findById(previous);
                if (prod) {
                    const prodWithCount = await ProductWithCount.changeFromProduct(prod, cnt);
                    products.push(prodWithCount);
                }
                cnt = 0;
            }
            cnt++;
            previous = prod_id;
        }
        if (previous != -1) {
            const prod = await Product.findById(previous);
            if (prod) {
                const prodWithCount = await ProductWithCount.changeFromProduct(prod, cnt);
                products.push(prodWithCount);
            }
        }
    }
    let sum = 0;
    for (const x of products) {
        sum += x.price * x.qt;
    }

    
});
