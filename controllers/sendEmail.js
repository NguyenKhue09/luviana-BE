import nodemailer from "nodemailer"
import { pugEngine } from "nodemailer-pug-engine"

export const sendEmail = async(email, username, url, txt) => {
    
    try {
        const transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
                user: process.env.SENDER,
                pass: process.env.PASSWORD,
            },
        });

        transporter.use('compile', pugEngine({
            templateDir: "./template",
            pretty: true
        }))

        const mailOptions = {
            from: process.env.SENDER,
            to: `${email}`,
            subject: txt,
            template: "template",
            ctx: {
                name: username,
                url: url
            }
        };
        transporter.sendMail(mailOptions);

        return {
            success: true,
            message: "Send mail success. Check your email"
        }
    } catch (error) {
        return {
            success: true,
            message: error.message
        }
    }
}