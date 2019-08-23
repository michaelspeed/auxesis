import { defaultApp } from "../app";
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

export const contactPostSubmit = (req: Request, res: Response) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  console.log(req);
  defaultApp.firestore().collection("contact")
      .add({
          name,
          surname,
          email,
          subject,
          message
      }).then(value => {
          res.redirect("/");
      }).catch(error => {
          res.render("error", {error: error});
      });
};
