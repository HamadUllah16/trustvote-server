const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


function fileUpload(buffer, fileType) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: fileType },
            (error, result) => {
                if (error) {
                    console.error('Error in Cloudinary upload:', error);
                    reject(error);
                } else {
                    console.log('File uploaded to Cloudinary:', result.secure_url);
                    resolve(result.secure_url);
                }
            }
        );

        // Convert buffer to a stream and pipe it to Cloudinary
        uploadStream.end(buffer);
    });
};

module.exports = { fileUpload }