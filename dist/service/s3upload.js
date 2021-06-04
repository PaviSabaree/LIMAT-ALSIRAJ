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
exports.s3upload = void 0;
const fs = require("fs");
const AWS = require("aws-sdk");
AWS.config.region = `${process.env.AWS_REGION}`;
exports.s3upload = (fileName, req) => __awaiter(void 0, void 0, void 0, function* () {
    var outJson = { status: false, filePath: "" };
    var s3 = new AWS.S3({
        apiVersion: '2006-03-01', accessKeyId: `${process.env.ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.SECRET_KEY}`
    });
    const fileContent = fs.readFileSync(req.files[0].path);
    const s3params = {
        Bucket: `${process.env.BUCKET_NAME}`,
        Key: fileName,
        Body: fileContent,
        ACL: 'public-read'
    };
    return new Promise(function (resolve, reject) {
        s3.upload(s3params, function (err, s3data) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    resolve(outJson);
                }
                fs.unlinkSync(req.files[0].path);
                outJson.status = true;
                outJson.filePath = s3data.Location;
                resolve(outJson);
            });
        });
    }).catch(function (error) {
        throw error;
    });
    // Uploading files to the bucket
});
//# sourceMappingURL=s3upload.js.map