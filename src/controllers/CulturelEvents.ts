import { defaultApp } from "../app";
import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
    res.render("CulturalEvents", {
        title: "CulturalEvents"
    });
};

export const ranshakPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum =req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("ranshak")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const kallasteiaPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum =req.body.cn;
    
    console.log(req);
    defaultApp.firestore().collection("kallasteria")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};


export const culturalExchangePostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum =req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("culturalExchange")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const xobdePostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum =req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("xobde")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const goStreetzPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum =req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("goStreetz")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const euphonicsPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum =req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("euphonics")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};

export const chromaticWaltzPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum =req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("chromaticWatls")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};


export const rootsPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum =req.body.cn;

    console.log(req);
    defaultApp.firestore().collection("Roots")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/");
        }).catch(error => {
            res.render("error", {error: error});
        });
};
