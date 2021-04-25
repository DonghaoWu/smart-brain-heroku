const { Client } = require('pg');
const dbSetting = process.env.DATABASE_URL ?
    {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
    :
    {
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_LOCAL_DB,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT
    }

const db = new Client(dbSetting);

db.connect();

module.exports = db;