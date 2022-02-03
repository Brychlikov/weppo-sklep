import { Request, Response } from "express";
import express from "express";
import {User } from "../models/User";
export const searchRouter = express.Router();

searchRouter.get("/", async (req: Request, res: Response) => {
    if(req.signedCookies.user){
        const user = await User.findByName(req.signedCookies.user);
        res.render("search.ejs", { user : user, url : "/search",
        cart_item_count : req.signedCookies.cart_item_count });
    }else{
        res.render("search.ejs", { url : "/search",
        cart_item_count : req.signedCookies.cart_item_count });
    }
});
