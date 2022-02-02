import { Request, Response } from "express";
import express from "express";

export const searchRouter = express.Router();

searchRouter.get("/", (req: Request, res: Response) => {
    if(req.signedCookies.user){
        res.render("search.ejs", { user : req.signedCookies.user, url : "/search",
        cart_item_count : req.signedCookies.cart_item_count });
    }else{
        res.render("search.ejs", { url : "/search",
        cart_item_count : req.signedCookies.cart_item_count });
    }
});
