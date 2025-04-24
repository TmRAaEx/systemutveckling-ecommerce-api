//base file for routes
import { Router, Request, Response } from "express";
export const baseRoutes = Router();

baseRoutes.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeSctipt");
});

//import other routes


