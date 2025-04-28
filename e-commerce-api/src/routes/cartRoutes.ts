import CartController from "@controllers/CartController";
import { Router } from "express";

const router = Router();
const cartController = new CartController();
router.get("/:id", cartController.getById);
router.post("/create", cartController.create);

export default router;
