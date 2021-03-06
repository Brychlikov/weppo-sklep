import express from "express";
import logger from "morgan";
import * as path from "path";
import session from "express-session";
import PgStoreMod from "connect-pg-simple";
import { pool } from "./dbConnection";
import fs from "fs"

const pgSession = PgStoreMod(session);

import { errorHandler, errorNotFoundHandler } from "./middlewares/errorHandler";



const uploadPath = './public/uploads'
// setup folder for uploads
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}


// Routes
import { index } from "./routes/index";
// Create Express server
export const app = express();

app.use(express.urlencoded({ extended: true }));
// Express configuration

// disable caching for now
app.disable("etag");

app.use(session({
    store: new pgSession({
        pool,
    }),
    secret: process.env.COOKIE_SECRET!,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 10 },
}));

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", index);

app.use(errorNotFoundHandler);
app.use(errorHandler);
