import { Router } from "express";

import { indexRouter } from "../controllers/index";
import { productsRouter } from "../controllers/products";
import { userRouter } from "../controllers/login";
import { createAccountRouter } from "../controllers/createAccount";
import { cartRouter } from "../controllers/cart";
import { searchRouter } from "../controllers/search";
import { checkoutRouter } from "../controllers/checkout";
import { accountRouter } from "../controllers/account";
export const index = Router();

index.use("/", indexRouter);
index.use("/products", productsRouter);
index.use("/login", userRouter);
index.use("/createAccount", createAccountRouter);
index.use("/cart", cartRouter);
index.use("/search", searchRouter);
index.use("/checkout", checkoutRouter);
index.use("/account", accountRouter);
