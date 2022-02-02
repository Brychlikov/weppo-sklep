import { Request, Response } from "express";
import { Product } from "../models/Product";
import express from "express";
import { authorize } from "./authorize";

/**
 * GET /
 * Home page.
 */

export const cartRouter = express.Router();
var cookieParser = require("cookie-parser");
cartRouter.use(express.urlencoded({ extended: true }));
cartRouter.use(cookieParser("sgs90890s8g90as8rg90as8g9r8a0srg8"));

cartRouter.get(
    "/",
    authorize("Admin", "Normal"),
    (req: Request, res: Response) => {
        (async function () {
            var products = [];
            if (req.signedCookies.cart) {
                for (var prod_id in req.signedCookies.cart) {
                    var prod = await Product.findById(Number(prod_id));
                    products.push(prod);
                }
            }
            // products = await Product.getAll();
            res.render("index", { products: products }); // user : req.user
        })();
    },
);
