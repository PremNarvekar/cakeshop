import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: 'candycake/uploads',
      format: (file.mimetype.split('/')[1] === 'jpeg' ? 'jpg' : file.mimetype.split('/')[1]), // Cloudinary prefers 'jpg' over 'jpeg'
      resource_type: isVideo ? 'video' : 'image',
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

// File filter (Optional but good for safety)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp|mp4/;
  const isAllowed = allowedTypes.test(file.mimetype.toLowerCase());

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Images and MP4 Videos only!'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
});
