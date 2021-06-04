"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_enum_1 = require("./config/constant.enum");
const express = require("express");
const mongodb = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const upload = multer({ dest: `upload/` });
class App {
    constructor(appInit) {
        this.app = express();
        this.app.use(cors());
        this.app.use(upload.any());
        this.port = appInit.port;
        this.middlewares(appInit.middleWares);
        this.routes(appInit.controllers);
        this.assets();
        this.template();
    }
    middlewares(middleWares) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare);
        });
    }
    routes(controllers) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
    assets() {
        this.app.use(express.static('public'));
        this.app.use(express.static('views'));
    }
    template() {
        this.app.set('view engine', 'pug');
    }
    listening() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the http://localhost:${this.port}`);
        });
    }
    dbConnection() {
        // Connecting to the database
        mongodb.connect(constant_enum_1.DBConnection.dbConnection, { useNewUrlParser: true, useUnifiedTopology: true, }).then(() => {
            console.log("Successfully connected to the database !!");
            this.listening();
        }).catch((err) => {
            console.log('Could not connect to the database. Exiting now...', err);
            process.exit();
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map