const cloudinary=require("cloudinary").v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary=(fileBuffer, fileName,folder)=>{
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            public_id:fileName,
        }, (error, result) => {
            if (error) {
                console.log("Error uploading file to Cloudinary:", error);
                
                reject(error);
            } else {
                console.log("File uploaded to Cloudinary:", result);
                
                resolve(result);
            }
        });
    
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

module.exports={
    uploadOnCloudinary
};