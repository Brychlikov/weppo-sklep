import { Router } from "express";
import * as controller from "../controllers/index";

import { uploadRouter } from "../controllers/productAdd";
import { userRouter } from "../controllers/login";
import { createAccountRouter } from "../controllers/createAccount";
export const index = Router();

index.get("/", controller.index);
index.use("/products", uploadRouter);
index.use("/login", userRouter)
index.use("/createAccount", createAccountRouter);