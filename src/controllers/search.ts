import { Request, Response } from "express";
import express from "express";
import { Product } from "../models/Product";
import {User } from "../models/User";
import { authorize } from "./authorize";

export const searchRouter = express.Router();

interface QueryI {
    query: string
}

searchRouter.get("/", async (req: Request<unknown, unknown, unknown, QueryI>, res: Response) => {
    const { query } = req.query;

    const prods = await Product.searchFuzzy(query);
    
    if(req.signedCookies.user){
        const user = await User.findByName(req.signedCookies.user);
        res.render("search.ejs", { user, url : "/search",
        cart_item_count : req.signedCookies.cart_item_count, query, products: prods });
    }else{
        res.render("search.ejs", { url : "/search",
        cart_item_count : req.signedCookies.cart_item_count, query, products: prods });
    }
});
