import { Readable } from "stream";
import * as fs from "fs";

var AWS = require('aws-sdk');
AWS.config.region = 'ap-south-1';

// const utils =  (binary) => {
//     const readableInstanceStream = new Readable({
//         read() {
//             this.push(binary);
//             this.push(null);
//         }
//     });

//     return readableInstanceStream;

// }


export const s3upload =  async (fileName,req) => {

    var outJson = { status: false, filePath: "" };

    var s3 = new AWS.S3({
        apiVersion: '2006-03-01', accessKeyId: 'AKIA4PNQLD5QMDJVN77V',
        secretAccessKey: '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'
    });

    const fileContent = fs.readFileSync(req.files[0].path);

    const s3params = {
        Bucket: 'alsiraj-s3-bucket-testing',
        Key: fileName, // File name you want to save as in S3
        Body: fileContent,
        ACL: 'public-read'

    };

    return new Promise(function (resolve, reject) {
        s3.upload(s3params, async function (err, s3data) {
            console.log("s3 response",err,s3data);
            if (err) {
                resolve(outJson);
            }
            fs.unlinkSync(req.files[0].path);
            outJson.status = true;
            outJson.filePath = s3data.Location;
            resolve(outJson);
        });
    }).catch(function(error) {
        throw error;
    })

    // Uploading files to the bucket
   
}

