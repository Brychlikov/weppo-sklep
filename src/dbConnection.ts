import knexMod from "knex";
import process from "process";
import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

export const knex = knexMod({
    client: "pg",
    connection: {
        host: "localhost",
        port: 5432,
        user: process.env['PG_USER'],
        password: process.env['PG_PASSWORD'],
        database: process.env['PG_DB_NAME'],
    },
});

export const pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB_NAME,
});
