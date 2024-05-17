const AWS = require("aws-sdk");
require('dotenv').config();


AWS.config.update({
    region: process.env.AWS_DEFAULT_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// const uploadFileToS3 = async (fileKey, fileBody) => {
//     const params = {
//         Bucket: BUCKET_NAME,
//         Key: fileKey,
//         Body: fileBody
//     };
//     console.log(fileKey)
    
//     console.log(fileBody)
//     try {
//         const data = await s3.upload(params).promise();
//         console.log("File uploaded successfully:", data.Location);
//         return data.Location;
//     } catch (error) {
//         throw error;
//     }
// };
const uploadFileToS3 = async (fileKey, fileBody) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: fileBody // Assuming 'fileBody' is a Buffer or Stream
    };
    
    try {
        const data = await s3.putObject(params).promise();

        // Construct the file URL
        const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

        // Return the file URL
        return fileUrl;
    } catch (error) {
        // If there's an error, throw it
        throw error;
    }
};

const downloadFileFromS3 = async (cloudFrontLink) => {
    // Extract the file key from the CloudFront link
    const urlParts = cloudFrontLink.split('/');
    const fileKey = urlParts[urlParts.length - 1];

    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey
    };

    try {
        const data = await s3.getObject(params).promise();
        return data.Body;
    } catch (error) {
        throw error;
    }
};

// Usage example
const cloudFrontLink = 'http://d10vtxeo7xa4r3.cloudfront.net/';
downloadFileFromS3(cloudFrontLink)
    .then(data => {
        // Handle downloaded file data
        console.log('File downloaded successfully');
    })
    .catch(error => {
        // Handle error
        console.error('Error downloading file:', error);
    });
const deleteFileFromS3 = async (fileKey) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileKey
    };

    try {
        // Delete the object from the S3 bucket
        await s3.deleteObject(params).promise();
        return { message: 'File deleted successfully' };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    uploadFileToS3,
    downloadFileFromS3,
    deleteFileFromS3
};
