"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
class EmailService {
    constructor() {
        this.sendMail = (mailOptions) => {
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
        };
    }
}
exports.default = EmailService;
//# sourceMappingURL=send.mail.js.map