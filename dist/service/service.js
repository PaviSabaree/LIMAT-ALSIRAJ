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
const user_schema_1 = require("../schema/user.schema");
const jwt = require("jsonwebtoken");
const send_mail_1 = require("./send.mail");
const paypal = require("paypal-rest-sdk");
class Service {
    constructor() {
        this.mailService = new send_mail_1.default();
    }
    /* function to create new User */
    signUp(userInformation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                });
                return yield user.save();
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
                    userName: userInformation.userName,
                    emailId: userInformation.emailId
                };
                const userDbInfo = yield user_schema_1.UserSchema.find({ 'emailId': userInformation.emailId }).exec();
                if (userDbInfo.length) {
                    const token = yield this.generateRefreshToken(user);
                    const refreshtoken = yield this.generateAccessToken(user);
                    return {
                        status: true,
                        message: "Signin Successfully.",
                        data: {
                            status: true,
                            token,
                            refreshtoken,
                        },
                        userType: userDbInfo[0]['userType'],
                        userDbInfo
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
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_schema_1.UserSchema.find({ 'userType': 'Public' }).exec();
            }
            catch (error) {
                console.log('error while getting user list from db ', error);
                throw error;
            }
        });
    }
    sendMail(emailInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mailOption = {
                    to: emailInfo.emailId,
                    subject: emailInfo.subject,
                    text: emailInfo.emailBody
                };
                return yield this.mailService.sendMail(mailOption);
            }
            catch (error) {
                console.log('error while sendMail ', error);
                throw error;
            }
        });
    }
    getAdmins(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user.userType === 'admin') {
                    return yield user_schema_1.UserSchema.find({ 'userType': 'admin' }).exec();
                }
                throw new Error('Only admin can view the admin list, You are not allowed');
            }
            catch (error) {
                console.log('error while getting user list from db ', error);
                throw error;
            }
        });
    }
    subscriptions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:8000/success",
                    "cancel_url": "http://localhost:8000/cancel"
                },
                "transactions": [{
                        "item_list": {
                            "items": [{
                                    "name": "Alsiraj membership",
                                    "sku": "001",
                                    "price": "5.00",
                                    "currency": "USD",
                                    "quantity": 1
                                }]
                        },
                        "amount": {
                            "currency": "USD",
                            "total": "5.00"
                        },
                        "description": "Hat for the best team ever"
                    }]
            };
            console.log('payment', create_payment_json);
            // call the create Pay method 
            yield this.createPayment(create_payment_json)
                .then((transaction) => {
                console.log('transaction', transaction);
                var id = transaction['id'];
                var links = transaction['links'];
                var counter = links.length;
                while (counter--) {
                    if (links[counter].method == 'REDIRECT') {
                        // redirect to paypal where user approves the transaction 
                        return res.redirect(links[counter].href);
                    }
                }
            })
                .catch((err) => {
                console.log(err);
                res.redirect('/err');
            });
        });
    }
    generateAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        });
    }
    generateRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30m' });
        });
    }
    createPayment(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                paypal.payment.create(payment, function (err, payment) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(payment);
                    }
                });
            });
        });
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map