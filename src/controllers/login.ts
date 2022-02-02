import { Request, Response } from "express";
import express from "express";
import { User as UserModel } from "../models/User";

export const userRouter = express.Router();

var bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
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
    var result = false;
    var username = assertGet(req.body, "txtUser");
    var user = UserModel.findByName(username);
    if (user != null) {
        console.log(2);
        (async function () {
            var attemptedPassword = assertGet(req.body, "txtPwd");
            var password = await UserModel.getUsersPassword(username);
            result = await bcrypt.compare(attemptedPassword, password);
            if (result) {
                res.cookie("user", username, { signed: true });
                var returnUrl = req.query.returnUrl;
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
