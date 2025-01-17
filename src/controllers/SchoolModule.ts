import { defaultApp } from "../app";
import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
    res.render("SchoolModule", {
        title: "SchoolModule"
    });
};

export const warWordsPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("warWords")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("error");
        });
};

export const vibgyorPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("vibgyor")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("error");
        });
};

export const cineVisionPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("cineVision")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("error");
        });
};

export const blinkPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("blink")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("error");
        });
};
export const openMicPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("openMic")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("error");
        });
};

export const triavialwarWordsPostSubmit = (req: Request, res: Response) => {
    const tname = req.body.tname;
    const phno = req.body.phno;

    console.log(req);
    defaultApp.firestore().collection("trivialParadox")
        .add({
            tname,
            phno
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
        });
};

export const scienceExhibition = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("scienceExbihition")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("error");
        });
};