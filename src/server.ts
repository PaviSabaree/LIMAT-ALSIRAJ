import App from './app'
import * as bodyParser from 'body-parser'
import loggerMiddleware from './middleware/logger'

import HomeRoute from './routes/home/home.route'


const app = new App({
    port: 5000,
    controllers: [
        new HomeRoute()

    ],
    middleWares: [

        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware
    ],
})

app.dbConnection();
