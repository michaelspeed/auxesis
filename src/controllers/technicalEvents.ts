// @ts-ignore
import { defaultApp, MAIN_HTML } from "../app";
import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";

export const SENDGRID_API_KEY = "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";

export const index = (req: Request, res: Response) => {
    res.render("technicalEvents", {
        title: "technicalEvents"
    });
};

export const postSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const trans = req.body.trans;
    defaultApp.firestore().collection("aveza")
        .add({
            name,
            email,
            trans
        }).then(async (value) => {
        await sgMail.setApiKey(SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: "registration@atmiyo.technology",
            subject: "Registration Successful",
            html: MAIN_HTML,
        };
        await sgMail.send(msg);
        res.redirect("/success");
    }).catch(error => {
        console.log(error);
        res.render("error");
    });
};

export const devPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const project = req.body.project;
    defaultApp.firestore().collection("developerConference")
        .add({
            name,
            email,
            project;
        }).then(async (value) => {
            await sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: "registration@atmiyo.technology",
                subject: "Registration Successful",
                html: MAIN_HTML,
            };
            await sgMail.send(msg);
            res.redirect("/success");
        }).catch(error => {
            console.log(error);
            res.render("error");
        });
    };
export const roboAssultPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    defaultApp.firestore().collection("roboAssult")
        .add({
            name,
            email
        }).then(async (value) => {
            await sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: "registration@atmiyo.technology",
                subject: "Registration Successful",
                html: MAIN_HTML,
            };
            await sgMail.send(msg);
            res.redirect("/success");
        }).catch(error => {
            console.log(error);
            res.render("error");
        });
    };

export const roboSoccerPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    defaultApp.firestore().collection("roboSoccer")
        .add({
            name,
            email
        }).then(async (value) => {
            await sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: "registration@atmiyo.technology",
                subject: "Registration Successful",
                html: MAIN_HTML,
            };
            await sgMail.send(msg);
            res.redirect("/success");
        }).catch(error => {
            console.log(error);
            res.render("error");
        });
    };
export const SurvivorBotPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    defaultApp.firestore().collection("survivorBot")
        .add({
            name,
            email
        }).then(async (value) => {
            await sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: "registration@atmiyo.technology",
                subject: "Registration Successful",
                html: MAIN_HTML,
            };
            await sgMail.send(msg);
            res.redirect("/success");
        }).catch(error => {
            console.log(error);
            res.render("error");
        });
    };
export const cubiconPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;

    console.log(req);
    defaultApp.firestore().collection("cubicon")
        .add({
            name,
            email,
        }).then(async (value) => {
            await sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: "registration@atmiyo.technology",
                subject: "Registration Successful",
                html: MAIN_HTML,
            };
            await sgMail.send(msg);
            res.redirect("/success");
        }).catch(error => {
            console.log(error);
            res.render("error");
        });
    };
export const techExPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const project = req.body.project;
    console.log(req);
    defaultApp.firestore().collection("techExhibition")
        .add({
            name,
            email,
            project
        }).then(async (value) => {
            await sgMail.setApiKey(SENDGRID_API_KEY);
            const msg = {
                to: email,
                from: "registration@atmiyo.technology",
                subject: "Registration Successful",
                html: MAIN_HTML,
            };
            await sgMail.send(msg);
            res.redirect("/success");
        }).catch(error => {
            console.log(error);
            res.render("error");
        });
    };