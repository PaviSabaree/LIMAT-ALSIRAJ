import App from './app'
import * as bodyParser from 'body-parser'
import loggerMiddleware from './middleware/logger'

import HomeRoute from './routes/home/home.route'
import AuthRoute from './routes/auth/auth.route'

const app = new App({
    port: 5000,
    middleWares: [

        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        loggerMiddleware
    ],
    controllers: [
        new HomeRoute(),
        new AuthRoute()
    ],
})

app.dbConnection();
