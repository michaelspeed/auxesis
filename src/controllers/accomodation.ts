import { Request, Response } from "express";
import { defaultApp } from "../app";

export const index = (req: Request, res: Response) => {
    res.render("accomodation", {
        title: "Accomodation"
    });
};

export const boysPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const candidateNumber = req.body.candidateNumber;
    const checkIn = req.body.checkIn;
    const checkOut = req.body.checkOut;
    defaultApp.firestore().collection("boysAccomodation")
        .add({
            name,
            email,
            phone,
            candidateNumber,
            checkIn,
            checkOut
        }).then(() => {
        res.redirect("/success");
    }).catch(error => {
        console.log(error);
        res.redirect("/error");
    });
};

export const girlsPostSubmit = (req: Request, res: Response) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const candidateNumber = req.body.candidateNumber;
    const checkIn = req.body.checkIn;
    const checkOut = req.body.checkOut;
    defaultApp.firestore().collection("girlsAccomodation")
        .add({
            name,
            email,
            phone,
            candidateNumber,
            checkIn,
            checkOut
        }).then(() => {
        res.redirect("/success");
    }).catch(error => {
        console.log(error);
        res.redirect("/error");
    });
};