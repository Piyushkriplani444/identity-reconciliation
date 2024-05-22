import express, { Express, Request, Response } from 'express';
const identityRouter = require('./identity-resolve/routes/index');
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', identityRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
