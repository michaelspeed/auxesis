import { Request, Response } from "express";
import { defaultApp } from "../app";

export const index = (req: Request, res: Response) => {
    res.render("workshop", {
        title: "Workshop"
    });
};

export const IOSPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    defaultApp.firestore().collection("Android&IOS")
        .add({
            name,
            email,
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("error");
        });
};

export const roboticsPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    defaultApp.firestore().collection("robotics")
        .add({
            name,
            email,
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("error");
        });
};

export const icEnginePostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    console.log(req);
    defaultApp.firestore().collection("icEngine")
        .add({
            name,
            email,
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("error");
        });
};