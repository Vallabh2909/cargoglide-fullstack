import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
function getPublicIdFromUrl(cloudinaryUrl) {
    const parts = cloudinaryUrl.split('/');
    const publicIde = parts[parts.length - 1];
    const publicId = publicIde.split('.')[0];
    return publicId;
  }

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export const deleteImage=async(url)=>{
    const publicId=getPublicIdFromUrl(url);
    
        cloudinary.uploader
        .destroy(publicId)
        .then(result => console.log(result));
  
}

export default uploadOnCloudinary; 
