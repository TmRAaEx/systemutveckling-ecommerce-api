//app setup
import express, { Express } from "express";
import { router } from "./routes";
import stripeRouter from "./routes/stripeRoutes";
import cors from "cors";

export const app: Express = express();

//middelwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/api", router);
app.use("/stripe", stripeRouter);
