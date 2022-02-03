import { Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import process from "process";
import { authorize } from "./authorize";
import { Order } from "../models/Order";
import { User } from "../models/User";

export const accountRouter = express.Router();
accountRouter.use(express.urlencoded({ extended: true }));
accountRouter.use(cookieParser(process.env.COOKIE_SECRET));

accountRouter.get(
    "/",
    authorize("Normal", "Admin"),
    async (req: Request, res: Response) => {
        const user= await User.findByName(req.signedCookies.user);
        let orders : Order[];
        orders = [];
        if(user){
             const pom = await Order.findByUserId(user.id);
             if(pom) orders = pom;
        }
        // console.log(orders[0].products[0].id);
        res.render("account.ejs", {
            orders : orders,
            url: "/account",
            cart_item_count: req.signedCookies.cart_item_count,
            user: req.signedCookies.user,
        });
    },
);

accountRouter.post(
    "/",
    authorize("Normal", "Admin"),
    (req: Request, res: Response) => {
        res.cookie("user", 0, { maxAge : -1 });
        res.cookie("cart", 0, { maxAge : -1 });
        res.redirect("/");
    },
);
