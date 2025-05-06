import express, { Router } from "express";
import bodyParser from "body-parser";

import StripeController from "@controllers/PaymentController";

const stripeController = new StripeController();
const router = Router();

router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeController.webHookEvents
);

router.post(
  "/create-checkout",
  express.json(),
  stripeController.createCheckoutSession
);
router.get(
  "/session-status",
  express.json(),
  stripeController.getSessionStatus
);

export default router;
