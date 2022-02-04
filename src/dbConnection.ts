import knexMod from "knex";
import process from "process";
import dotenv from "dotenv";
import pg from "pg";
dotenv.config();

export const knex = knexMod({
    client: "pg",
    connection: { 
        connectionString: process.env.DATABASE_URL, 
        ssl: { rejectUnauthorized: false },
    }
 });

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }});
