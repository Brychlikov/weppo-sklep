import { Request, Response } from "express";
import { Product } from "../models/Product";

/**
 * GET /
 * Home page.
 */

export const index = async (req: Request, res: Response): Promise<void> => {
    // const products = [
    //     { id: 0, name: "cygan", price: 12, description: "to jest cygan" },
    //     { id: 1, name: "bodzio", price: 15, description: "taki o bodź" },
    // ];
    const products = await Product.getAll();
    console.log(products);


    // TODO : remove express.js logic from controller to route handler
    // TODO2 : maybe not
    res.render("index", { products: products });
};
