import { defaultApp } from "../app";
import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
    res.render("CreativityEvents", {
        title: "CreativityEvents"
    });
};

export const candidPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("candidPhotography")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.redirect("/error");
        });
};

export const wastePostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("wasteToWealth")
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

export const doodlingPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("DoodleArt")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
        });
};

export const megaPixelPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("megaPixel")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
        });
};

export const grafityPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("grafity")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
        });
};

export const treasureHuntPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("tresureHunt")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.render("/error");
        });
};









