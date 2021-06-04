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
const nodemailer = require("nodemailer");
class EmailService {
    sendMail(mailOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'alsirajmailer@gmail.com',
                        pass: 'Alsiraj@mailer2021'
                    }
                });
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error(`Email failed and the reson is :  ${error.message}`);
                    }
                    else {
                        console.info(`Email send successfully:  ${info}`);
                        console.debug(`Email Content`, mailOptions);
                    }
                    return `Email sent ${info}`;
                });
            }
            catch (error) {
                throw error;
            }
        });
    }
    ;
}
exports.default = EmailService;
//# sourceMappingURL=send.mail.js.map