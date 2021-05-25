
import * as fs from "fs";
import * as AWS from 'aws-sdk'

AWS.config.region = `${process.env.AWS_REGION}`;

export const s3upload =  async (fileName,req) => {

    var outJson = { status: false, filePath: "" };

    var s3 = new AWS.S3({
        apiVersion: '2006-03-01', accessKeyId: `${process.env.ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.SECRET_KEY}`
    });

    const fileContent = fs.readFileSync(req.files[0].path);

    const s3params = {
        Bucket: `${process.env.BUCKET_NAME}`,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent,
        ACL: 'public-read'

    };

    return new Promise(function (resolve, reject) {
        s3.upload(s3params, async function (err, s3data) {

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

