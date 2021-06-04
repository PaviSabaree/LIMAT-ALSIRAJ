"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const bodyParser = require("body-parser");
const logger_1 = require("./middleware/logger");
const express = require("express");
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
var cors = require('cors');
const home_route_1 = require("./routes/home/home.route");
const auth_route_1 = require("./routes/auth/auth.route");
const member_skill_route_1 = require("./routes/skills/member-skill.route");
const event_route_1 = require("./routes/events/event.route");
const participations_route_1 = require("./routes/participations/participations.route");
const paypal = require("paypal-rest-sdk");
const server = express();
const swaggerDocument = YAML.load('docs/swagger.yaml');
const app = new app_1.default({
    port: process.env.PORT || 8000,
    middleWares: [
        bodyParser.json({ limit: '50mb' }),
        bodyParser.urlencoded({ limit: '50mb', extended: true }),
        logger_1.default
    ],
    controllers: [
        new home_route_1.default(),
        new auth_route_1.default(),
        new member_skill_route_1.default(),
        new event_route_1.default(),
        new participations_route_1.default()
    ],
});
// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AYsgr-D5cjaFn3nFFut2XL5YhCuqFh0M52TEdYtGdJrNaSzKJaNOlNtrdVXq1x9JN96goLO1e891yg50',
    'client_secret': 'EL6QnWqfUAKJ18DX_pHB6Zk4w2hw6RX3fppvbMEfhnfqK8I0rQktsvQddrarPM285_RikMOcFUTZn0Q2' // provide your client secret here 
});
app.dbConnection();
app.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.app.get('/', (req, res) => {
    console.log('cosole', __dirname + '/index.html');
    res.sendFile(__dirname + '/index.html');
});
app.app.get('/success', (req, res) => {
    console.log(req.query);
    res.sendFile(__dirname + '/success.html');
});
// error page 
app.app.get('/err', (req, res) => {
    console.log(req.query);
    res.sendFile(__dirname + '/err.html');
});
//# sourceMappingURL=server.js.map