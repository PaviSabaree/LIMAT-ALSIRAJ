"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const service_1 = require("../../service/service");
class HomeRoute {
    constructor() {
        this.router = express.Router();
        this.getUsers = (req, res) => {
            const result = this.service.getUsers();
            res.send(result);
        };
        this.router.get('/', this.getUsers);
        this.service = new service_1.default();
    }
}
exports.default = HomeRoute;
//# sourceMappingURL=home.route.js.map