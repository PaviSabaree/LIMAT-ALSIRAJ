import App from './app'
import * as bodyParser from 'body-parser'
import loggerMiddleware from './middleware/logger'
import * as express from 'express'

import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';

import HomeRoute from './routes/home/home.route'
import AuthRoute from 'routes/auth/auth.route'
import authenticateToken from 'middleware/authentication'

const server: express.Application = express();

const options = {
    swaggerOptions: {
      supportedSubmitMethods: []
    }
  };

const swaggerDocument = YAML.load('docs/swagger.yaml');

server.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, options)
  );
  
  server.all('/swagger.json', (req, res) => {
    console.info(`swagger document called`);
  
    return res.json(swaggerDocument);
  });


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
        authenticateToken
    ],
})

app.dbConnection();
