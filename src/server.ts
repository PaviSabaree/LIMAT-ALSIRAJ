import App from './app'
import * as bodyParser from 'body-parser'
import loggerMiddleware from './middleware/logger'
import * as express from 'express'
import * as YAML from 'yamljs';

import * as swaggerUi from 'swagger-ui-express';
var cors = require('cors')
import HomeRoute from './routes/home/home.route'
import AuthRoute from './routes/auth/auth.route'
import MemberSkillRoute from './routes/skills/member-skill.route';
import EventRoutes from './routes/events/event.route';
import ParticipationsRoute from './routes/participations/participations.route';

const server: express.Application = express();

const swaggerDocument = YAML.load('docs/swagger.yaml');

const app = new App({
    port: 8000,
    middleWares: [

		bodyParser.json({ limit: '50mb' }),
		bodyParser.urlencoded({ limit: '50mb', extended: true }),
        loggerMiddleware
    ],
    controllers: [
        new HomeRoute(),
        new AuthRoute(),
        new MemberSkillRoute(),
        new EventRoutes(),
        new ParticipationsRoute()
    ],
})



app.dbConnection();

app.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


