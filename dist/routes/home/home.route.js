"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const service_1 = require("../../service/service");
class HomeRoute {
    constructor() {
        this.router = express.Router();
        this.getUsers = (req, res) => {
            const result = this.service.getUsers();
            console.log(result);
            res.send(result);
        };
        this._signup = (req, res) => {
            try {
                const { userName, firstName, lastName, password, emailId, phoneNumber, appUser, userType, documentUrl } = req.body;
                const result = this.service.signUp({ userName, firstName, lastName,
                    password, emailId, phoneNumber, appUser, userType, documentUrl });
                res.send(result);
            }
            catch (error) {
                res.status(400).send({
                    message: error
                });
            }
        };
        this.router.get('/', this.getUsers);
        this.router.post('/masters/any/users/add', this._signup);
        this.service = new service_1.default();
    }
}
exports.default = HomeRoute;
//# sourceMappingURL=home.route.js.map