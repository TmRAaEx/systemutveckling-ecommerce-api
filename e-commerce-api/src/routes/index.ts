import { Router } from "express";
import productRouter from "./productRoutes";
import userRouter from "./userRoutes";
import orderRouter from "./orderRoutes";
import cartRouter from "./cartRoutes";

export const router = Router();

router.use("/products", productRouter);
router.use("/users", userRouter);
router.use("/orders", orderRouter);
router.use("/carts", cartRouter);
// Fallback for undefined routes
router.use((req, res) => {
  res
    .status(404)
    .json({ error: `There is no api endpoint at this route ${req.url}` });
});
