import { Request, Response } from "express";
import express from "express";
import { User, User as UserModel } from "../models/User";

export const userRouter = express.Router();

var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser');
userRouter.use(express.urlencoded({ extended: true }));
userRouter.use(cookieParser('sgs90890s8g90as8rg90as8g9r8a0srg8'));

function assertGet(obj: any, prop: string) {
    if(prop in obj) {
        return obj[prop];
    } else {
        throw new Error(`failed to get ${prop} on object`);
    }
}

userRouter.get('/', (req: Request, res: Response) => {
    res.render('login.ejs');
});


userRouter.post('/', (req, res) => {
    var result = false;
    var username = assertGet(req.body, "txtUser");
    var user = UserModel.findByName(username);
    if(user != null){
        (async function () {
            var attemptedPassword = assertGet(req.body, "txtPwd");
            result = await bcrypt.compare(attemptedPassword, UserModel.getUsersPassword(username));
            if (result) {
                res.cookie('user', username, { signed: true });
                var returnUrl = req.query.returnUrl;
                // res.redirect('/');
                res.render('logged.ejs');
            } else {
                res.render('login.ejs', { message: "nieprawidłowe hasło lub nazwa użytkownika" });
            }
        })();
    }else{
<<<<<<< HEAD
        res.render('login.ejs', { message: "Zła nazwa logowania lub hasło" });
=======
        console.log(4);
        res.render('login.ejs', { message: "nieprawidłowe hasło lub nazwa użytkownika" });
>>>>>>> c056caf (basic styling)
    }
});

userRouter.get('/logged', (req, res) => {
    res.render('logged.ejs');
})