import knexMod from "knex";
import process from "process";
import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

export const knex = knexMod({
    client: "pg",
    connection: process.env.DATABASE_URL });

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL});
