import { defaultApp } from "../app";
import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
    res.render("CreativityEvents", {
        title: "CreativityEvents"
    });
};

export const canvasPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("canvas")
        .add({
            name,
            email,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.redirect("error");
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
            res.redirect("/error");
        });
};

export const artExpoPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("artExpo")
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

export const TalentgPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const address = req.body.address;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("TalentHunt")
        .add({
            name,
            address,
            phoneNum
        }).then(value => {
            res.redirect("/success");
        }).catch(error => {
            res.redirect("/error");
        });
};










