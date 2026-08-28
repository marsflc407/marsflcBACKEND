import nodemailer from "nodemailer";
import { COMPANY } from "../config/company.js";

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, text, html, from }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: from || process.env.SMTP_USER || COMPANY.email,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

export const sendPasswordResetOtp = async ({ to, otp }) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    throw new Error("Resend email configuration is missing");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to: [to],
      subject: "Your MARS admin password reset code",
      text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend email failed with status ${response.status}`);
  }
};

export const sendApplicationEmail = async ({
  position,
  name,
  email,
  phone,
  coverLetter,
  cvLink,
}) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.SMTP_USER || COMPANY.email,
    to: COMPANY.email,
    subject: `New Job Application - ${position}`,
    text: `Position: ${position}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nCover Letter: ${coverLetter || "N/A"}\nCV Link: ${cvLink || "N/A"}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937;">
        <h2 style="margin-bottom: 12px; color: #991b1b;">New Job Application</h2>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Cover Letter:</strong></p>
        <p>${(coverLetter || "N/A").replace(/\n/g, "<br />")}</p>
        <p><strong>CV Link:</strong> <a href="${cvLink || "#"}">${cvLink || "N/A"}</a></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  return { success: true };
};

export default {
  sendEmail,
  sendApplicationEmail,
  sendPasswordResetOtp,
};
