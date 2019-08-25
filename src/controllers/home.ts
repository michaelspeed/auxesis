import { defaultApp } from "../app";
import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export const index = (req: Request, res: Response) => {
  res.render("home", {
    title: "Home"
  });
};

export const sponsorPostSubmit = (req: Request, res: Response) => {
  const name = req.body.name;
  const company = req.body.company;
  const email = req.body.email;
  const state = req.body.state;
  const phoneNum = req.body.cn;
  console.log(req);
  defaultApp.firestore().collection("sponsor")
      .add({
          name,
          company,
          email,
          state,
          phoneNum
      }).then(value => {
          res.redirect("/success");
      }).catch(error => {
          res.render("error");
      });
};

