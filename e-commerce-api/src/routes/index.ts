//base file for routes

import { Router } from "express";
import productRouter from "./productRoutes";
import userRouter from "./userRoutes";
export const router = Router();

router.use("/products", productRouter);
router.use("/users", userRouter);

//import other routes
