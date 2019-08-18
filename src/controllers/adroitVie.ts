import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
    res.render("adroitVie", {
        title: "AdroitVie"
    });
};