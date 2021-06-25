"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalApi = exports.ClienUrl = exports.DBConnection = void 0;
var DBConnection;
(function (DBConnection) {
    DBConnection["dbConnection"] = "mongodb+srv://Alsiraj:Suriya95!@cluster0.pbkvi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
})(DBConnection = exports.DBConnection || (exports.DBConnection = {}));
var ClienUrl;
(function (ClienUrl) {
    ClienUrl["clientURL"] = "http://65.0.89.156:8080";
})(ClienUrl = exports.ClienUrl || (exports.ClienUrl = {}));
var PaypalApi;
(function (PaypalApi) {
    PaypalApi["MODE"] = "sandbox";
    PaypalApi["CLIENT"] = "AfJeTfrVBHkVfvFgjRmpv8z2-jDeQprZ6DMMAXdgLXsn_BIS3rlW6VOEqhfa79bY-gYziHCyLSidP3ar";
    PaypalApi["SECRET"] = "EK-QBsOc0nPguci13VC5md7gUwu9FBbyOVIXmthtcASzKWRsuZY7LP3jIppeooxafyZbkulZayDQZxDX";
})(PaypalApi = exports.PaypalApi || (exports.PaypalApi = {}));
//# sourceMappingURL=constant.enum.js.map