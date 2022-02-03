import { Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import process from "process";
import { createAccountRouter } from "./createAccount";
import { authorize } from "./authorize";

export const adminRouter = express.Router();
adminRouter.use(express.urlencoded({ extended: true }));
adminRouter.use(cookieParser(process.env.COOKIE_SECRET));

adminRouter.get(
    "/",
    authorize("Admin"),
    (req: Request, res: Response) => {
        res.render("admin.ejs", {
            url: "/admin",
            cart_item_count: req.signedCookies.cart_item_count,
            user: req.signedCookies.user,
        });
    },
);
