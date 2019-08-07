import nodemailer from "nodemailer";
import { Request, Response } from "express";
import { check, validationResult } from "express-validator";

const transporter = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

/**
 * GET /contact
 * Contact form page.
 */
export const index = (req: Request, res: Response) => {
  res.render("contact", {
    title: "Contact"
  });
};
