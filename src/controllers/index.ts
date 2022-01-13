import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */

export const index = async (req: Request, res: Response): Promise<void> => {
    const products = [
        { id: 0, name: "cygan", price: 12, description: "to jest cygan" },
        { id: 1, name: "bodzio", price: 15, description: "taki o bodź" },
    ];
    res.render("index", { products: products });
};
