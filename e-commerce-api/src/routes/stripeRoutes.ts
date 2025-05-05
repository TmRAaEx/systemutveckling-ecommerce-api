import { application, Router } from "express";
import bodyParser from "body-parser";

import StripeController from "@controllers/PaymentController";

const stripeController = new StripeController();
const router = Router();

router.post("/create-checkout", stripeController.createCheckoutSession);
router.get("/session-status", stripeController.getSessionStatus);
router.post(
  "/webhoook",
  bodyParser.raw({ type: "application/json" }),
  stripeController.webHookEvents
);

export default router;
