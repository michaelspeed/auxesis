import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
    res.render("gallery", {
        title: "Gallery"
    });
};
