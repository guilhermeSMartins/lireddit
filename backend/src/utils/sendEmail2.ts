import nodemailer from 'nodemailer';

export async function sendEmail(to: string, html: string) {
    let transporter = nodemailer.createTransport({
        host: ''
    });
}