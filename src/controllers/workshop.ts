import { Request, Response } from "express";
import { defaultApp, MAIN_HTML } from "../app";
import sgMail from "@sendgrid/mail";

export const SENDGRID_API_KEY = "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";
export const index = (req: Request, res: Response) => {
    res.render("workshop", {
        title: "Workshop"
    });
};

export const IOSPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    console.log(req);
    defaultApp.firestore().collection("Android&IOS")
        .add({
            name,
            email,
            phone
        }).then(() => {
            // async (value) => {
            // await sgMail.setApiKey(SENDGRID_API_KEY);
            // const msg = {
            //     to: email,
            //     from: "registration@atmiyo.technology",
            //     subject: "Registration Successful",
            //     html: MAIN_HTML,
            // };
            // await sgMail.send(msg);
            res.redirect("/success");
        }).catch(error => {
            console.log(error);
            res.redirect("/error");
        });
};
    export const matlabPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    console.log(req);
    defaultApp.firestore().collection("matlab")
        .add({
            name,
            email,
            phone
        }).then(() => {
            // async (value) => {
            // await sgMail.setApiKey(SENDGRID_API_KEY);
            // const msg = {
            //     to: email,
            //     from: "registration@atmiyo.technology",
            //     subject: "Registration Successful",
            //     html: MAIN_HTML,
            // };
            // await sgMail.send(msg);
            res.redirect("/success");
        }).catch(error => {
            console.log(error);
            res.redirect("/error");
        });
};
export const icEnginePostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const slot = req.body.first;
    console.log(req);
    defaultApp.firestore().collection("icEngine")
        .add({
            name,
            email,
            phone,
            slot
        }).then( () => {
            // async (value) => {
            // await sgMail.setApiKey(SENDGRID_API_KEY);
            // const msg = {
            //     to: email,
            //     from: "registration@atmiyo.technology",
            //     subject: "Registration Successful",
            //     html: MAIN_HTML,
            // };
            // await sgMail.send(msg);
            res.redirect("/success");
        }).catch(error => {
            console.log(error);
            res.redirect("/error");
        });
};

