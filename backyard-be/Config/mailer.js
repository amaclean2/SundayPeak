import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'esperanza38@ethereal.email',
        pass: 'jTNT2sWT8nUu9YNWth'
    }
});