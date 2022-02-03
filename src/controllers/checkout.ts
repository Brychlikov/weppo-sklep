import { Request, Response } from "express";
import express from "express";

export const checkoutRouter = express.Router();

checkoutRouter.get("/", (req: Request, res: Response) => {
    res.render("checkout.ejs", {
        user: req.signedCookies.user,
        url: "/checkout",
        cart_item_count: req.signedCookies.cart_item_count,
    });
});
