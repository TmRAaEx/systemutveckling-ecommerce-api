import LineItem from "@models/base/LineItem";
import BaseController from "./BaseController";
import Order from "@models/entities/Order";
import { mongoDBClient } from "@config/database";
const stripe = require("stripe")(process.env.STRIPE_API_KEY);

export default class StripeController extends BaseController {
  public createCheckoutSession = this.handle(async (req, res) => {
    const { lineItems, orderId } = req.body;

    const { client_secret } = await this.createStripeCheckoutSession(
      lineItems,
      orderId
    );

    res.status(200).json({ clientSecret: client_secret });
  });

  public getSessionStatus = this.handle(async (req, res) => {
    const { session_id } = req.query;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.status(200).json({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details.email,
    });
  });

  public webHookEvents = this.handle(async (req, res) => {
    const signature = req.headers["stripe-signature"];

    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (error) {
      res.status(400).send(`Stripe webhook error ${(error as Error).message}`);
      return;
    }

    try {
      await this.handleWebhookEvents(event);
    } catch (error) {
      res.status(500).json({
        message:
          error instanceof Error ? `${error.message}` : "Unexpected error",
      });
    }
  });

  private async handleWebhookEvents(event: any) {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const { id: payment_id, client_reference_id: orderId } = session;
        // update order with payment reference
        const order = new Order();
        order.id = mongoDBClient.toObjectId(orderId);
        await order.load();
        order.payment_ref = payment_id;
        await order.save();

        break;  
      default:
        console.log(`[stripe webhook]: Unhandled event type: ${event.type}`);
    }

    return;
  }

  /**
   * Private helper function to create a Stripe checkout session.
   * @param lineItems - The line items for the checkout session.
   * @param orderId - The order ID to associate with the session.
   * @returns The created Stripe checkout session.
   */
  private async createStripeCheckoutSession(
    lineItems: LineItem[],
    orderId: Order["id"]
  ): Promise<any> {
    return await stripe.checkout.sessions.create({
      line_items: [...lineItems],
      mode: "payment",
      ui_mode: "embedded",
      client_reference_id: orderId,
      return_url:
        "http://localhost:5173/order-confirmation?session_id={CHECKOUT_SESSION_ID}",
    });
  }
}
