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
const auth_service_1 = require("../../service/auth/auth.service");
class AuthRoute {
    constructor() {
        this.router = express.Router();
        this._signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userName, firstName, lastName, password, emailId, phoneNumber, appUser, userType, documentUrl, socialAuth } = req.body;
                const result = yield this.authService.signUp({ userName, firstName, lastName,
                    password, emailId, phoneNumber, appUser, userType, documentUrl, socialAuth });
                if (!result && result === undefined) {
                    throw new Error('unable to save');
                }
                res.json({ data: result });
            }
            catch (err) {
                console.log("Error occured in _signup", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._signIn = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { emailId, password } = req.body;
                const result = yield this.authService.signIn({
                    password, emailId
                });
                if (!result && result === undefined) {
                    throw new Error('unable to get details');
                }
                res.json({ data: result });
            }
            catch (err) {
                console.log("Error occured in _signIn", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._getAuthToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tokens = yield this.authService.getAccessToken(req.body.token);
                if (!tokens && tokens === undefined) {
                    throw new Error('unable to get access token');
                }
                const response = {
                    status: true,
                    msg: 'new token created successfully',
                    refreshtoken: tokens.refreshToken,
                    token: tokens.accessToken
                };
                res.json(response);
            }
            catch (err) {
                console.log("Error occured in _signIn", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this._upload = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.authService.uploadFileToS3(req);
                res.json({ data: result });
            }
            catch (err) {
                console.log("Error occured in _upload", err);
                res.status(400).json({
                    message: err
                });
            }
        });
        /**
         * password reset request initiate
         */
        this._pwdResetRequest = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { emailId } = req.body;
                const result = yield this.authService.pwdResetRequest(emailId);
                if (!result && result === undefined) {
                    throw new Error('unable to get details');
                }
                res.json({ data: result });
            }
            catch (err) {
                console.log("Error occured in _pwdResetRequest", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        /**
         * password reset / update call
         */
        this._pwdReset = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, password, token } = req.body;
                const result = yield this.authService.pwdReset({
                    userId, password, token
                });
                if (!result && result === undefined) {
                    throw new Error('unable to get details');
                }
                res.json({ data: result });
            }
            catch (err) {
                console.log("Error occured in _pwdReset", err);
                res.status(400).json({
                    message: err.toString()
                });
            }
        });
        this.router.post('/masters/any/users/add', this._signup);
        this.router.put('/masters/any/update/user', this._signup);
        this.router.post('/auth/signin', this._signIn);
        this.router.post('/auth/getAuthToken', this._getAuthToken);
        this.router.post('/auth/upload', this._upload);
        this.router.post('/auth/password_reset', this._pwdResetRequest);
        this.router.put('/auth/password_update', this._pwdReset);
        this.authService = new auth_service_1.default();
    }
}
exports.default = AuthRoute;
//# sourceMappingURL=auth.route.js.map