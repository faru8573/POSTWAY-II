import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendMail = async function sendMail(email, textMsg) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "breakneck6303@gmail.com",
      pass: "vnub cizj tipi xfhl",
    },
  });

  const mailOptions = {
    from: "breakneck6303@gmail.com",
    to: email,
    subject: "Reset password",
    text: textMsg,
  };
  try {
    await transport.sendMail(mailOptions);
    console.log("Reset email sent successfully");
  } catch (error) {
    console.log("Email send failer with error: " + error);
  }
};
