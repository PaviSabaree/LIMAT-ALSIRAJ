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
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const s3upload_1 = require("../s3upload");
const user_schema_1 = require("../../schema/user.schema");
const send_mail_1 = require("../send.mail");
const request_reset_password_html_1 = require("../../templates/request-reset-password.html");
const reset_password_html_1 = require("../../templates/reset-password.html");
const constant_enum_1 = require("../../config/constant.enum");
class AuthService {
    constructor() {
        this.refreshTokens = [];
        this.mailService = new send_mail_1.default();
    }
    /* function to create new User */
    signUp(userInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkExistingUser = yield this._checkExistinguser(userInformation.emailId);
                const tokenInfo = {
                    emailId: userInformation.emailId,
                    password: userInformation.password,
                    userType: userInformation.userType,
                };
                const token = yield this._generateAccessToken(tokenInfo);
                const refreshtoken = yield this._generateRefreshToken(tokenInfo);
                console.log('db user value ==', checkExistingUser);
                if (checkExistingUser) {
                    if (userInformation.socialAuth && userInformation.userType) {
                        const dbResponse = yield user_schema_1.UserSchema.findOneAndUpdate({ 'emailId': userInformation.emailId }, {
                            $set: {
                                'userType': userInformation.userType
                            }
                        }).exec();
                        return {
                            'checkExistingUser': dbResponse,
                            data: {
                                status: true,
                                token,
                                refreshtoken,
                            }
                        };
                    }
                    if (userInformation.socialAuth) {
                        return {
                            checkExistingUser,
                            data: {
                                status: true,
                                token,
                                refreshtoken,
                            }
                        };
                    }
                    else {
                        throw new Error('User Already Exist with this mail Id, Please user different user or use forget passoword');
                    }
                }
                else {
                    const user = new user_schema_1.UserSchema({
                        userName: userInformation.userName,
                        firstName: userInformation.firstName,
                        lastName: userInformation.lastName,
                        password: userInformation.password,
                        emailId: userInformation.emailId,
                        phoneNumber: userInformation.phoneNumber,
                        appUser: userInformation.appUser,
                        userType: userInformation.userType,
                        documentUrl: userInformation.documentUrl,
                        socialAuth: userInformation.socialAuth ? true : false
                    });
                    const result = yield user.save();
                    if (userInformation.socialAuth) {
                        return {
                            result,
                            data: {
                                status: true,
                                token,
                                refreshtoken,
                            }
                        };
                    }
                    else {
                        return result;
                    }
                }
            }
            catch (err) {
                console.log("Exception occured in signUp", err);
                throw err;
            }
        });
    }
    /* function to Login and get accessToken and RefreshToken */
    signIn(userInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = {
                    emailId: userInformation.emailId,
                    password: userInformation.password,
                };
                const userDbInfo = yield user_schema_1.UserSchema.find({ 'emailId': userInformation.emailId }).exec();
                console.log('userDbInfo', userDbInfo);
                const passwordValidation = yield this._isValidPassword(userDbInfo[0].password, user.password);
                user.userType = userDbInfo[0]['userType'];
                if (!passwordValidation) {
                    throw new Error('Given password is wrong please check you passwod');
                }
                if (userDbInfo.length) {
                    const token = yield this._generateAccessToken(user);
                    const refreshtoken = yield this._generateRefreshToken(user);
                    this.refreshTokens.push(refreshtoken);
                    return {
                        status: true,
                        message: "Signin Successfully.",
                        data: {
                            status: true,
                            token,
                            refreshtoken,
                        },
                        userType: userDbInfo[0]['userType'],
                        userDbInfo: userDbInfo[0]
                    };
                }
                else {
                    throw new Error('User Not found, Please signUp or please check your mail');
                }
            }
            catch (err) {
                console.log("Exception occured in signIn", err);
                throw err;
            }
        });
    }
    getAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let accessToken = '';
                let refreshToken = '';
                if (token == null && !this.refreshTokens.includes(token)) {
                    throw new Error('not a valid token');
                }
                jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject(err);
                    }
                    accessToken = yield this._generateAccessToken({
                        emailId: user.emailId,
                        password: user.password,
                        userType: user.userType
                    });
                    refreshToken = yield this._generateRefreshToken({
                        emailId: user.emailId,
                        password: user.password,
                        userType: user.userType
                    });
                    resolve({ accessToken, refreshToken });
                }));
            });
        });
    }
    uploadFileToS3(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var dateObj = new Date().toLocaleDateString().split('/');
                var filename = "userupload/" + dateObj.join('') + "/" + req.files[0].originalname;
                var s3upl = s3upload_1.s3upload(filename, req);
                s3upl.then(function (result) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (result && result['status']) {
                            resolve({ "status": true, "message": "succesfully uploaded", filePath: result['filePath'] });
                        }
                        else {
                            resolve({ "status": true, "message": "succesfully uploaded", filePath: "" });
                        }
                    });
                }).catch((error) => {
                    console.log('Error while uploading the file');
                    reject(error);
                });
            });
        });
    }
    pwdResetRequest(emailId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userInfo = yield this._checkExistinguser(emailId);
                if (!userInfo) {
                    throw new Error('User does not exist');
                }
                const tokenInfo = {
                    emailId: userInfo.emailId,
                    password: userInfo.password,
                    userType: userInfo.userType,
                };
                const resetToken = yield this._generateAccessToken(tokenInfo);
                const link = `${constant_enum_1.ClienUrl.clientURL}/passwordReset?token=${resetToken}&id=${userInfo._id}`;
                let bodyContent = request_reset_password_html_1.reqResetPwd;
                bodyContent = bodyContent.toString().replace('_name', userInfo.userName).replace('_link', link);
                console.log(bodyContent);
                const mailOption = {
                    to: emailId,
                    subject: "Password Reset Request",
                    html: bodyContent
                };
                return this.mailService.sendMail(mailOption);
            }
            catch (err) {
                console.log("Exception occured in pwdResetRequest", err);
                throw err;
            }
        });
    }
    pwdReset(pwdRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isValid = yield this._verifyToken(pwdRequest.token);
                if (!isValid) {
                    throw new Error("Invalid or expired token");
                }
                const salt = yield bcrypt.genSalt(5);
                const hashPassword = yield bcrypt.hash(pwdRequest.password, salt);
                yield user_schema_1.UserSchema.updateOne({ _id: pwdRequest.userId }, { $set: { password: hashPassword } }, { new: true });
                const user = yield user_schema_1.UserSchema.findById({ _id: pwdRequest.userId });
                let bodyContent = reset_password_html_1.resetPwdSucces;
                bodyContent = bodyContent.toString().replace('_name', user.userName);
                const mailOption = {
                    to: user.emailId,
                    subject: "Password Reset Successfully",
                    html: bodyContent
                };
                return yield this.mailService.sendMail(mailOption);
            }
            catch (error) {
                console.log("Exception occured in pwdReset", error);
                throw error;
            }
        });
    }
    _verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let isValidToken = false;
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
                if (err) {
                    throw err;
                }
                isValidToken = true;
            });
            return isValidToken;
        });
    }
    _checkExistinguser(emailId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbResponse = yield user_schema_1.UserSchema.findOne({ 'emailId': emailId }).exec();
            console.log(dbResponse);
            return dbResponse;
        });
    }
    _generateAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('qq', user);
            return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        });
    }
    _generateRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' });
        });
    }
    _isValidPassword(hashPassword, inputPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bcrypt.compare(inputPassword, hashPassword);
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map