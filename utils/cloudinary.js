const cloundinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();


cloundinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


exports.fileUpload = async (localFilePath, fileType) => {
    console.log('file upload accessed.')
    try {
        if (!localFilePath) {
            console.log('Invalid path');
            return null
        }
        //upload the file to cloudinary from local
        const response = await cloundinary.uploader.upload(localFilePath, { resource_type: fileType });

        console.log('file uploaded to cloudinary', response.url);
        return response.url;

    } catch (error) {
        //remove file from local
        // fs.unlinkSync(localFilePath);
        console.log('Error in cloudinary upload: ', error)
        return null
    }
}

// module.exports = fileUpload;