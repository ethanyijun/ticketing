import nodemailer from "nodemailer";

export class NodeMailer {
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "ethan.yijun@gmail.com", // Gmail address
        pass: process.env.EMAIL_PASSWORD!, // App Password or Gmail password
      },
    });
  }
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: "ethan.yijun@gmail.com",
      to,
      subject,
      text,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}
