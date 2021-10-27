import { Client } from 'pg';

export const db = new Client({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'Token',
    port: 5432
});

db.connect();