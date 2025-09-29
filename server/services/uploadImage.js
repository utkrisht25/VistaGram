// services/uploadImage.js
import cloudinary from './cloudinary.js';

export const uploadBuffer = (buffer, folder = 'vistagram') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
