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
        let users : User[];
        users = [];
        const pom2 = await User.getAll();
        if(pom2) users = pom2;
        res.render("admin.ejs", {
            orders : orders,
            url: "/admin",
            cart_item_count: req.signedCookies.cart_item_count,
            user: user,
            users : users,
        });
    },
);

adminRouter.post(
    "/",
    authorize("Admin"),
    (req: Request, res: Response) => {
        res.cookie("user", 0, { maxAge : -1 });
        res.cookie("cart", 0, { maxAge : -1 });
        res.redirect("/");
    },
);