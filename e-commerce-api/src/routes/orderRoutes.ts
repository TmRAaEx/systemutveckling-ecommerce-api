import OrderController from "@controllers/OrderController";
import { Router } from "express";

const router = Router();

const orderController = new OrderController();

router.get("/", orderController.getAll);

router.get("/:id", orderController.getById);

router.post("/create", orderController.create);

router.patch("/update/:id", orderController.update);

router.get("/paymentId/:payment_ref", orderController.getByPaymentRef);

export default router;
