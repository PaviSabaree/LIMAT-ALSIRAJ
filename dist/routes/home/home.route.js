"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const authentication_1 = require("../../middleware/authentication");
const service_1 = require("../../service/service");
class HomeRoute {
    constructor() {
        this.router = express.Router();
        this.getUsers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.service.getUsers();
                res.json(result);
            }
            catch (err) {
                console.log("Error occured in getting user list", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this.getAdmins = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.service.getAdmins(req.user);
                res.json(result);
            }
            catch (err) {
                console.log("Error occured in getting admin list", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._sendMail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.sendMail(req.body);
                const response = {
                    status: 200,
                    message: `SucessFully sent mail to ${req.body.emailId}`
                };
                res.json(response);
            }
            catch (err) {
                console.log("Error occured in getting admin list", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this.router.get('/masters/any/users/list', authentication_1.default, this.getUsers);
        this.router.get('/masters/any/admin/list', authentication_1.default, this.getAdmins);
        this.router.post('/masters/any/email/add', authentication_1.default, this._sendMail);
        this.service = new service_1.default();
    }
}
exports.default = HomeRoute;
function Router() {
    throw new Error('Function not implemented.');
}
//# sourceMappingURL=home.route.js.map