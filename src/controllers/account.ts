import { Request, Response } from "express";
import express from "express";
import cookieParser from "cookie-parser";
import process from "process";
import { createAccountRouter } from "./createAccount";
import { authorize } from "./authorize";

export const accountRouter = express.Router();
accountRouter.use(express.urlencoded({ extended: true }));
accountRouter.use(cookieParser(process.env.COOKIE_SECRET));

accountRouter.get(
    "/",
    authorize("Normal", "Admin"),
    (req: Request, res: Response) => {
        res.render("account.ejs", {
            url: "/account",
            cart_item_count: req.signedCookies.cart_item_count,
            user: req.signedCookies.user,
        });
    },
);
