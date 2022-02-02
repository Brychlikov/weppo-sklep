import { Request, Response } from "express";
import { Product } from "../models/Product";
import express from "express";
import { authorize } from "./authorize";

/**
 * GET /
 * Home page.
 */

export const indexRouter = express.Router();
var cookieParser = require("cookie-parser");
indexRouter.use(express.urlencoded({ extended: true }));
indexRouter.use(cookieParser("sgs90890s8g90as8rg90as8g9r8a0srg8"));

// TODO : remove express.js logic from controller to route handler
// TODO2 : maybe not
indexRouter.get(
    "/",
    authorize("Normal", "Admin"),
    (req: Request, res: Response) => {
        (async function () {
            const products = await Product.getAll();
            res.render("index", {
                products: products,
                user: req.signedCookies.user,
            }); // user : req.user
        })();
    },
);

indexRouter.get("/annonymous", (req, res) => {
    (async function () {
        const products = await Product.getAll();
        res.render("index", { products: products }); // user : req.user
    })();
});
