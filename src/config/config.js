const dotenv = require('dotenv');
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

module.exports = {
    development: {
        databases: {
            identity: {
                username: process.env.DB_USERNAME1,
                password: process.env.DB_PASSWORD1,
                database: process.env.DB_DATABASE1,
                host: process.env.DB_HOST1,
                port: process.env.DB_PORT1,
                dialect: 'postgres',
                logging: false
            }
        }
    },

    identity: {
        username: process.env.DB_USERNAME1,
        password: process.env.DB_PASSWORD1,
        database: process.env.DB_DATABASE1,
        host: process.env.DB_HOST1,
        port: process.env.DB_PORT1,
        dialect: 'postgres'
    },

    production: {
        databases: {
            identity: {
                username: process.env.DB_USERNAME1,
                password: process.env.DB_PASSWORD1,
                database: process.env.DB_DATABASE1,
                host: process.env.DB_HOST1,
                port: process.env.DB_PORT1,
                dialect: 'postgres',
                logging: false
            }
        }
    }
};
