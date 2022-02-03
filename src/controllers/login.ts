import { Request, Response } from "express";
import express from "express";
import { User as UserModel } from "../models/User";
import { compare } from "bcrypt";
import cookieParser from "cookie-parser";
import process from "process";
export const userRouter = express.Router();

userRouter.use(express.urlencoded({ extended: true }));
userRouter.use(cookieParser(process.env.COOKIE_SECRET));

function assertGet(obj: any, prop: string): string {
    if (prop in obj) {
        return obj[prop];
    } else {
        throw new Error(`failed to get ${prop} on object`);
    }
}

userRouter.get("/", (req: Request, res: Response) => {
    // console.log(req.query.message);
    if(req.query.message){
        res.render("login.ejs", { message : req.query.message, url : "/login", 
        cart_item_count : req.signedCookies.cart_item_count });
    }
    else res.render("login.ejs", { url : "/login", cart_item_count : req.signedCookies.cart_item_count });
});

userRouter.post("/", async (req, res) => {
    let result = false;
    const username = assertGet(req.body, "txtUser");
    const user = UserModel.findByName(username);
    if (user != null) {
        (async function () {
            const attemptedPassword = assertGet(req.body, "txtPwd");
            const password = await UserModel.getUsersPassword(username);
            result = await compare(attemptedPassword, password);
            if (result) {
                res.cookie("user", username, { signed: true });
                res.cookie("cart_item_count", 0, { signed : true });
                const returnUrl = req.query.returnUrl;
                res.redirect("/");
            } else {
                res.render("login.ejs", {
                    message: "nieprawidłowe hasło lub nazwa użytkownika",
                    url : "/login",
                    cart_item_count : req.signedCookies.cart_item_count,
                });
            }
        })();
    } else {
        res.render("login.ejs", {
            message: "nieprawidłowe hasło lub nazwa użytkownika",
            url : "/login",
            cart_item_count : req.signedCookies.cart_item_count,
        });
    }
});
