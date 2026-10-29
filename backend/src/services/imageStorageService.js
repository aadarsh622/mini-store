const { v2: cloudinary } = require('cloudinary');
const environment = require('../config/environment');
const AppError = require('../utils/AppError');

const getDetectedImageType = (buffer) => {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return { mimeType: 'image/jpeg', format: 'jpg' };
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { mimeType: 'image/png', format: 'png' };
  }

  if (
    buffer.length >= 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return { mimeType: 'image/webp', format: 'webp' };
  }

  throw new AppError('Uploaded file is not a valid JPEG, PNG, or WebP image', 400);
};

const uploadProductImage = async (file) => {
  const detectedType = getDetectedImageType(file.buffer);
  if (file.mimetype !== detectedType.mimeType) {
    throw new AppError('Image content does not match its declared file type', 400);
  }

  const cloudinarySettings = {
    cloud_name: environment.CLOUDINARY_CLOUD_NAME,
    api_key: environment.CLOUDINARY_API_KEY,
    api_secret: environment.CLOUDINARY_API_SECRET,
  };
  if (Object.values(cloudinarySettings).some((value) => !value)) {
    throw new AppError('Image storage is not configured. Set the Cloudinary environment variables.', 503);
  }

  cloudinary.config(cloudinarySettings);

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'mini-store/products', resource_type: 'image' },
      (error, uploadResult) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(uploadResult);
      }
    );
    stream.end(file.buffer);
  }).catch((error) => {
    console.error('Cloudinary product image upload failed:', error.message);
    throw new AppError('Image storage upload failed. Please try again.', 502);
  });

  return {
    image: result.secure_url,
    imageMetadata: {
      provider: 'cloudinary',
      publicId: result.public_id,
      format: result.format || detectedType.format,
      bytes: result.bytes,
      width: result.width,
      height: result.height,
    },
  };
};

module.exports = { uploadProductImage };
