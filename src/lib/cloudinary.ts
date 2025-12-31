import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Upload file to Cloudinary
 * @param file File buffer or path
 * @param folder Cloudinary folder name
 * @param resourceType Type of resource (image, raw, video, auto)
 */
export async function uploadToCloudinary(
  file: string | Buffer,
  folder: string,
  resourceType: 'image' | 'raw' | 'video' | 'auto' = 'auto'
) {
  try {
    const result = await cloudinary.uploader.upload(
      typeof file === 'string' ? file : `data:application/octet-stream;base64,${file.toString('base64')}`,
      {
        folder: `gnfoundation/${folder}`,
        resource_type: resourceType,
      }
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'raw' | 'video' = 'image') {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return true;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}
