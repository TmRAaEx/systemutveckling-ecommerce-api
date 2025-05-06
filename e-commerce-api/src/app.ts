//app setup
import express, { Express } from "express";
import { router } from "./routes";
import stripeRouter from "./routes/stripeRoutes";
import cors from "cors";

export const app: Express = express();

//stripe routes must be here

//middelwares
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/stripe", stripeRouter);

app.use("/api", express.json(), router);
