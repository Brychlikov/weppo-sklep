import { Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import process from "process";
import { Order } from "../models/Order";
import { authorize } from "./authorize";
import { User } from "../models/User";

export const adminRouter = express.Router();
adminRouter.use(express.urlencoded({ extended: true }));
adminRouter.use(cookieParser(process.env.COOKIE_SECRET));

adminRouter.get(
    "/",
    authorize("Admin"),
    async (req: Request, res: Response) => {
        let orders : Order[]
        orders = [];
        const pom = await Order.getAll();
        if(pom) orders = pom;
        const user = await User.findByName(req.signedCookies.user);
        res.render("admin.ejs", {
            orders : orders,
            url: "/admin",
            cart_item_count: req.signedCookies.cart_item_count,
            user: user,
        });
    },
);
