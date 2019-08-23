import { Request, Response } from "express";
import { defaultApp } from "../app";

export const index = (req: Request, res: Response) => {
    res.render("Sports", {
        title: "Sports"
    });
};
export const hatrickPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("hattrick")
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


export const thirdPocketPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("thirdPocket")
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

export const tennisPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("tennis")
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

export const JogaPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phoneNum = req.body.cn;
    console.log(req);
    defaultApp.firestore().collection("JogaBonito")
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