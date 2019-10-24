import { Request, Response } from "express";
import { defaultApp } from "../app";

export const index = (req: Request, res: Response) => {
    res.render("adroitVie", {
        title: "AdroitVie"
    });
};

export const MLPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const nameOne = req.body.nameOne;
    const nameTwo = req.body.nameTwo;
    const nameThree = req.body.nameThree;
    const nameFour = req.body.nameFour;
    const nameFive = req.body.nameFive;
    const nameSix = req.body.nameSix;
    const leaderName = req.body.leaderName;
    const leaderID = req.body.leaderID;
    const phone = req.body.cn;
    defaultApp.firestore().collection("mobile_legends")
        .add({
            name,
            nameOne,
            nameTwo,
            nameThree,
            nameFour,
            nameFive,
            nameSix,
            leaderName,
            leaderID,
            phone
        }).then(() => {
        res.redirect("/success");
    }).catch(error => {
        console.log(error);
        res.redirect("/error");
    });
};

export const FifaPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.cn;
    defaultApp.firestore().collection("Fifa")
        .add({
            name,
            email,
            phone
        }).then(() => {
        res.redirect("/success");
    }).catch(error => {
        console.log(error);
        res.redirect("/error");
    });
};

export const pubGPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const nameOne = req.body.nameOne;
    const nameTwo = req.body.nameTwo;
    const nameThree = req.body.nameThree;
    const nameFour = req.body.nameFour;
    const leaderName = req.body.leaderName;
    const leaderID = req.body.leaderID;
    const phone = req.body.cn;
    defaultApp.firestore().collection("pubG")
        .add({
            name,
            nameOne,
            nameTwo,
            nameThree,
            nameFour,
            leaderName,
            leaderID,
            phone
        }).then(() => {
        res.redirect("/success");
    }).catch(error => {
        console.log(error);
        res.redirect("/error");
    });
};

export const CSPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const nameOne = req.body.nameOne;
    const nameTwo = req.body.nameTwo;
    const nameThree = req.body.nameThree;
    const nameFour = req.body.nameFour;
    const nameFive = req.body.nameFive;
    const leaderName = req.body.leaderName;
    const leaderID = req.body.leaderID;
    const phone = req.body.cn;
    defaultApp.firestore().collection("CSGo")
        .add({
            name,
            nameOne,
            nameTwo,
            nameThree,
            nameFour,
            nameFive,
            leaderName,
            leaderID,
            phone
        }).then(() => {
        res.redirect("/success");
    }).catch(error => {
        console.log(error);
        res.redirect("/error");
    });
};

export const TekkenPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const leaderID = req.body.leaderID;
    const phone = req.body.cn;
    defaultApp.firestore().collection("Tekken")
        .add({
            name,
            leaderID,
            phone
        }).then(() => {
        res.redirect("/success");
    }).catch(error => {
        console.log(error);
        res.redirect("/error");
    });
};