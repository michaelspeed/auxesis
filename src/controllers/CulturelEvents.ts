import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
    res.render("CulturalEvents", {
        title: "CulturalEvents"
    });
};