import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const notifyAdmin = async (task) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "Task Updated by User",
    html: `<p><b>${task.title}</b> was updated. New Status: ${task.status}</p>`,
  };

  await transporter.sendMail(mailOptions);
};
