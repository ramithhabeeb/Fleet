// Function to generate a 6-digit OTP
const nodemailer = require("nodemailer");
require('dotenv').config()

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a random 6-digit number
};

async function sendOTP(email, otp) {
    try {
        // Create a transporter (using Gmail as an example)
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.gmail, // Replace with your email
                pass: process.env.app_pass, // Use an App Password instead of your actual password
            },
        });

        // Email content
        let mailOptions = {
            from: `"Fleet" <${process.env.gmail}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
            html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

module.exports = { generateOTP, sendOTP };