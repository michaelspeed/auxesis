import  sgMail  from "@sendgrid/mail";
import { defaultApp, MAIN_HTML } from "../app";
import { Request, Response } from "express";
import { SENDGRID_API_KEY } from "./workshop";

export const index = (req: Request, res: Response) => {
    res.render("CulturalEvents", {
        title: "CulturalEvents"
    });
};
export const ranshakPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("ranshak")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
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
            res.render("error");
        });
};
export const kallasteiaPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("kallasteria")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
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
            res.render("error");
        });
    };
export const culturalExchangePostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("culturalExchange")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
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
            res.render("error");
        });
    };
export const xobdePostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("xobde")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
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
            res.render("error");
        });
    };
export const goStreetzPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("goStreetz")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
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
export const euphonicsPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("euphonics")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
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
            res.render("error");
        });
    };
export const chromaticWaltzPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    // const email = req.body.email;
    const phoneNum = req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("chromaticWatls")
        .add({
            name,
            // email,
            phoneNum
        }).then(value => {
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
export const rootsPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("Roots")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
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
            res.render("/error");
        });
};


export const tseriesPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("T-Series")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
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
            res.render("error");
        });
};