import knexMod from "knex";
import process from "process";
import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

const herokuConf = {
        connectionString: process.env.DATABASE_URL, 
        ssl: { rejectUnauthorized: false },
};

const noHerokuConf = {
    connectionString: process.env.DATABASE_URL, 
};
let config;

if (process.env.HEROKU) {
    config = herokuConf;
} else {
    console.log("not on heroku");
    config = noHerokuConf;
}

export const knex = knexMod({
    client: "pg",
    connection: config,
 });

export const pool = new pg.Pool(config);
