import User from '@/models/user.model';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    console.log(email,emailType,userId)
    const token = crypto.randomBytes(32).toString('hex'); // Secure random token
    const tokenExpiry = Date.now() + 3600000; // 1-hour expiry

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: tokenExpiry
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: tokenExpiry
      });
    }

    // Configure mail transporter securely
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "aymi.coding@gmail.com", // Store credentials in .env
        pass: "pymw yblp hlff gipx",
      },
    });

    const actionUrl = `${process.env.DOMAIN}/${emailType === "VERIFY" ? "verifyemail" : "resetpassword"}?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailType === "VERIFY" ? "Verify your Email" : "Reset your Password",
      html: `<p>Click <a href="${actionUrl}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.</p>
             <p>Or copy and paste the link below into your browser:</p>
             <p>${actionUrl}</p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
