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
app.dbConnection();
app.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//# sourceMappingURL=server.js.map