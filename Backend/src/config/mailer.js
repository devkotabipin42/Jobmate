import nodemailer from 'nodemailer'
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

transporter.verify((error, success) => {
    if (error) {
        console.log('Email transporter error:', error)
    } else {
        console.log('Email transporter ready!')
    }
})

export default transporter