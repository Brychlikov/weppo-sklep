import { Request, Response } from "express";
import express from "express";
import { User as UserModel } from "../models/User";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

export const userRouter = express.Router();

userRouter.use(express.urlencoded({ extended: true }));
userRouter.use(cookieParser("sgs90890s8g90as8rg90as8g9r8a0srg8"));

function assertGet(obj: any, prop: string): string {
    if (prop in obj) {
        return obj[prop];
    } else {
        throw new Error(`failed to get ${prop} on object`);
    }
}

userRouter.get("/", (req: Request, res: Response) => {
    res.render("login.ejs");
});

userRouter.post("/", (req, res) => {
    let result = false;
    const username = assertGet(req.body, "txtUser");
    const user = UserModel.findByName(username);
    if (user != null) {
        console.log(2);
        (async function () {
            const attemptedPassword = assertGet(req.body, "txtPwd");
            const password = await UserModel.getUsersPassword(username);
            result = await bcrypt.compare(attemptedPassword, password);
            if (result) {
                res.cookie("user", username, { signed: true });
                const returnUrl = req.query.returnUrl;
                res.redirect("/");
            } else {
                res.render("login.ejs", {
                    message: "nieprawidłowe hasło lub nazwa użytkownika",
                });
            }
        })();
    } else {
        console.log(4);
        res.render("login.ejs", {
            message: "nieprawidłowe hasło lub nazwa użytkownika",
        });
    }
});

userRouter.get("/logged", (req, res) => {
    res.render("logged.ejs");
});
