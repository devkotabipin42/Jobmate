import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import ImageKit from 'imagekit'

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// })
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})
const logoStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'jobmate/logos',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 300, height: 300, crop: 'fill' }]
    }
})



export const uploadLogo = multer({ storage: logoStorage })

export const uploadCV = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF/DOC files allowed!'), false)
    }
})
export const uploadAvatar = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp']
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only images allowed!'), false)
    }
})

export const uploadDocument = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = [
            'image/jpeg', 'image/png', 'image/jpg', 'image/webp',
            'application/pdf'
        ]
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG, PDF allowed!'), false)
    }
})
export { imagekit }