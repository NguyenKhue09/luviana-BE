import nodemailer from "nodemailer"
import { pugEngine } from "nodemailer-pug-engine"

export const sendEmail = async(email, url, txt) => {
    const transporter = nodemailer.createTransport({
        service: "Gmail",
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
            name: userData.username,
            url: url
        }
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return {
                success: false,
                message: "Some thing wrong went send email!"
            };
        } else {
            console.log("Email sent: " + info.response);
            return { message: `Email has been sent to ${email}`, success: true};
        }
    });
}