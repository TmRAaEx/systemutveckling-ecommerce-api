import Order from "@models/entities/Order";
import BaseController from "./BaseController";
import Product from "@models/entities/Product";
import LineItem from "@models/base/LineItem";

export default class OrderController extends BaseController {
  public getAll = this.handle(async (req, res) => {
    const orders = await Order.getAll();
    res.status(200).json(orders);
  });

  public getById = this.handle(async (req, res) => {
    const { id } = req.params;
    const order = await this.createInstance(id, Order);
    order.lineItems.forEach((item) => {
      if (!item.productId) {
        return;
      }
      const product = new Product();
      product.id = item.productId;
      order.addProduct(product, item.quantity);
    });
    res.status(200).json(order);
  });

  public create = this.handle(async (req, res) => {
    const { customerDetails, lineItems } = req.body;
    const order = new Order();

    order.customerDetails = customerDetails;

    for (const item of lineItems) {
      if (!item.product) {
        continue;
      }
      const product = await this.createInstance(item.product.id, Product);
      product.price = item.product.price;
      order.addProduct(product, item.quantity);
    }

    await order.save();

    res.status(201).json(order);
  });

  public update = this.handle(async (req, res) => {
    const { id } = req.params; // Extract the order ID from the request parameters
    const { customerDetails, lineItems } = req.body; // Extract the updated data from the request body

    // Load the existing order
    const order = await this.createInstance(id, Order);
    // Update customer details if provided
    if (customerDetails) {
      order.customerDetails = {
        ...order.customerDetails,
        ...customerDetails, // Merge existing details with the new ones
      };
    }

    // Update line items if provided
    if (Array.isArray(lineItems)) {
      // Clear existing line items
      order.lineItems = [];

      // Add new line items
      lineItems.forEach((item: LineItem) => {
        if (!item.productId) {
          return;
        }
        const product = new Product();
        product.id = item.productId;
        order.addProduct(product, item.quantity);
      });
    }

    // Save the updated order to the database
    await order.save();

    // Respond with the updated order
    res.status(200).json(order);
  });
}
