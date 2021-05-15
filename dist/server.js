"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const bodyParser = require("body-parser");
const logger_1 = require("./middleware/logger");
const home_route_1 = require("./routes/home/home.route");
const app = new app_1.default({
    port: 5000,
    controllers: [
        new home_route_1.default()
    ],
    middleWares: [
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        logger_1.default
    ],
});
app.dbConnection();
app.listen();
//# sourceMappingURL=server.js.map