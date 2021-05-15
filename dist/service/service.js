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
class Service {
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
                    documentUrl: userInformation.documentUrl
                });
                yield user.save().then((data) => {
                    return data;
                });
            }
            catch (error) {
                console.error('Exception occured in signUp', error);
                throw error;
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    id: 1,
                    name: 'Rakesh'
                },
                {
                    id: 2,
                    name: 'Venkat'
                },
                {
                    id: 3,
                    name: 'Asharaf'
                }
            ];
        });
    }
}
exports.default = Service;
//# sourceMappingURL=service.js.map