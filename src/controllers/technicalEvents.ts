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