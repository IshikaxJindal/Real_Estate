// api/utils/cloudinaryStorage.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'mern-estate',
     allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
  },
});

const upload = multer({ storage });

export default upload;
