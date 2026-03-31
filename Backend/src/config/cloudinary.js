import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'jobmate/logos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 300, height: 300, crop: 'fill' }]
    }
})

const cvStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: 'jobmate/cvs',
        resource_type: 'raw',
        public_id: `cv_${Date.now()}`,
        format: 'pdf',
        access_mode: "public",
    })
})

export const uploadLogo = multer({ storage: logoStorage })

export const uploadCV = multer({
    storage: cvStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true)
        } else {
            cb(new Error('Only PDF files allowed!'), false)
        }
    }
})

export default cloudinary