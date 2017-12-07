import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as mysql from 'mysql';

class App {
    public express;

    constructor() {
        this.express = express();
        this.useMiddlewares();
    }

    private useMiddlewares(): void {
        //Parses incoming request
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
        //If error occures during parsing
        this.express.use((error, req, res, next) => {
            if (error) {
                res.json({ state: 422 });
            } else {
                next();
            }
        })
        this.express.use(cors());
    }
}

export default new App().express;