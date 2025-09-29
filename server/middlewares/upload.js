// middlewares/upload.js
import multer from 'multer';

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (!/image\/(png|jpg|jpeg|webp)/.test(file.mimetype)) return cb(new Error('Invalid image'), false);
  cb(null, true);
};
export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
