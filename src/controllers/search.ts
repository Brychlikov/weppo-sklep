import { Request, Response } from "express";
import express from "express";

export const searchRouter = express.Router();

searchRouter.get("/", (req: Request, res: Response) => {
    res.render("search.ejs");
});
