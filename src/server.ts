import App from './app'
import * as bodyParser from 'body-parser'
import loggerMiddleware from './middleware/logger'
import * as express from 'express'
import * as YAML from 'yamljs';

import * as swaggerUi from 'swagger-ui-express';

import HomeRoute from './routes/home/home.route'
import AuthRoute from './routes/auth/auth.route'

const server: express.Application = express();

const swaggerDocument = YAML.load('docs/swagger.yaml');


const app = new App({
    port: 5000,
    controllers: [
        new HomeRoute(),
        new AuthRoute()

    ],
    middleWares: [

        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware,
    ],
})

app.dbConnection();

app.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


