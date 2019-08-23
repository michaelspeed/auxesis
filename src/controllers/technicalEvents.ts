import { Request, Response } from "express";
import * as firebaseadmin from "firebase-admin";
import serviceAccount from "./aux.json";

firebaseadmin.initializeApp({
    credential: firebaseadmin.credential.cert(serviceAccount as any),
    databaseURL: "https://auxesis-v9.firebaseio.com"
  });

export const index = (req: Request, res: Response) => {
    res.render("technicalEvents", {
        title: "technicalEvents"
    });
};

export const postSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    firebaseadmin.firestore().collection("aveza")
        .add({
            name,
            email
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const devPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const project = req.body.project;
    console.log(req);
    firebaseadmin.firestore().collection("developerConference")
        .add({
            name,
            email,
            project
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const roboAssultPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    firebaseadmin.firestore().collection("roboAssult")
        .add({
            name,
            email
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const roboSoccerPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    firebaseadmin.firestore().collection("roboSoccer")
        .add({
            name,
            email
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const SurvivorBotPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    firebaseadmin.firestore().collection("survivorBot")
        .add({
            name,
            email
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const cubiconPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;

    console.log(req);
    firebaseadmin.firestore().collection("cubicon")
        .add({
            name,
            email,
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const techExPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const project = req.body.project;
    console.log(req);
    firebaseadmin.firestore().collection("techExhibition")
        .add({
            name,
            email,
            project
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};