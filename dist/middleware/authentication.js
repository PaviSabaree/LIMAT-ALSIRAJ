"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const authenticateToken = (req, resp, next) => {
    try {
        console.log('came to auth');
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token);
        if (token == null) {
            return resp.sendStatus(401);
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            console.log(err);
            if (err) {
                return resp.sendStatus(403);
            }
            console.log('token verified');
            req.user = user;
            next();
        });
    }
    catch (error) {
        console.log('Authentication error  ===', error);
        throw error;
    }
};
exports.default = authenticateToken;
//# sourceMappingURL=authentication.js.map