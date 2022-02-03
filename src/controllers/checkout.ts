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

    const products = await ProductWithCount.changeFromProductsId(req.signedCookies.cart);
    const sum = ProductWithCount.getCostOfAllProducts(products);

    
});
