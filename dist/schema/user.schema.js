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
exports.UserSchema = void 0;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Users = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phoneNumber: {
        type: String,
        required: false
    },
    appUser: {
        type: String,
        required: false
    },
    userType: {
        type: String,
        required: false
    },
    socialAuth: {
        type: Boolean,
        required: false
    },
    documentUrl: {
        type: String,
        required: false
    },
    isPaidMember: {
        type: Boolean,
        required: false,
    }
});
Users.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const salt = yield bcrypt.genSalt(5);
            const hashPassword = yield bcrypt.hash(this.password, salt);
            console.log('pasword', hashPassword);
            this.password = hashPassword;
        }
        catch (error) {
            next(error);
        }
    });
});
Users.methods.isValidPassword = function (password, hashPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield bcrypt.compare(password, hashPassword);
        }
        catch (error) {
            throw error;
        }
    });
};
exports.UserSchema = mongoose.model('sample', Users);
//# sourceMappingURL=user.schema.js.map