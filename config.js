require('dotenv').config();

module.exports = {
    URL_CLIENT: process.env.URL_CLIENT || 'http://localhost:3000',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME || 'videogames',

    PORT: process.env.PORT || 3001,
};
