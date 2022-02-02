import { Request, Response } from "express";
import express from "express";
import { User } from "../models/User";
import { hash } from "bcrypt";
export const createAccountRouter = express.Router();

// var bcrypt = require('bcrypt');
createAccountRouter.use(express.urlencoded({ extended: true }));

function assertGet(obj: any, prop: string) {
    if(prop in obj) {
        return obj[prop];
    } else {
        throw new Error(`failed to get ${prop} on object`);
    }
}

createAccountRouter.get('/', (req: Request, res: Response) => {
    res.render('createAccount.ejs', { url : "/createAccount", cart_item_count : req.signedCookies.cart_item_count });
});

createAccountRouter.post('/', (req, res) => {
    const userData: any = {};
    userData.name = assertGet(req.body, "txtUser");
    userData.role = 'Normal';
    const password = assertGet(req.body, "txtPwd");
    (async function () {
        userData.password = await hash(password, 10);
        const d = await User.addUser(userData);
        res.redirect('/login');
    })();
});
