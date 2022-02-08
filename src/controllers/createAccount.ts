import { Request, Response } from "express";
import express from "express";
import { User } from "../models/User";
import { hash } from "bcrypt";
export const createAccountRouter = express.Router();

// var bcrypt = require('bcrypt');
createAccountRouter.use(express.urlencoded({ extended: true }));

function assertGet(obj: any, prop: string) {
    if (prop in obj) {
        return obj[prop];
    } else {
        throw new Error(`failed to get ${prop} on object`);
    }
}

createAccountRouter.get("/", (req: Request, res: Response) => {
    res.render("createAccount.ejs", {
        url: "/createAccount",
        cart_item_count: req.signedCookies.cart_item_count,
        message: req.query.message,
    });
});

function validateEmail(email: string): boolean {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

createAccountRouter.post("/", (req, res) => {
    const userData: any = {};
    userData.name = assertGet(req.body, "txtUser");
    if (!validateEmail(userData.name)) {
        res.redirect("/createAccount?message=Niepoprawny email");
    } else {
        userData.role = "Normal";
        const password = assertGet(req.body, "txtPwd");
        (async function () {
            const check_if_exists = await User.findByName(userData.name);
            if (check_if_exists != null) {
                res.redirect(
                    "/createAccount?message=Na ten email istnieje już konto",
                );
                return;
            }
            userData.password = await hash(password, 10);
            const d = await User.addUser(userData);
            res.cookie("user", userData.name, { signed: true });
            res.cookie("cart_item_count", 0, { signed: true });
            res.redirect("/");
        })();
    }
});
