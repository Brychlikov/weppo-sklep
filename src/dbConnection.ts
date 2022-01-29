import knexMod from "knex";
import process from "process";
import dotenv from "dotenv";
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
