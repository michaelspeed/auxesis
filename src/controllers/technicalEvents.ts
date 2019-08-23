import { defaultApp } from "../app";
import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
    res.render("technicalEvents", {
        title: "technicalEvents"
    });
};

export const postSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    defaultApp.firestore().collection("aveza")
        .add({
            name,
            email
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
        });
};

export const devPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const project = req.body.project;
    console.log(req);
    defaultApp.firestore().collection("developerConference")
        .add({
            name,
            email,
            project
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
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
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
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
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
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
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
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
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
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
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
        });
};