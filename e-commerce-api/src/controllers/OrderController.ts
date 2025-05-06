import Order from "@models/entities/Order";
import BaseController from "./BaseController";
import Product from "@models/entities/Product";
import { ObjectId } from "mongodb";

export default class OrderController extends BaseController {
  public getAll = this.handle(async (req, res) => {
    const orders = await Order.getAll();
    res.status(200).json(orders);
  });

  public getById = this.handle(async (req, res) => {
    const { id } = req.params;
    const order = await this.createInstance(id, Order);

    order.lineItems;

    order.lineItems.forEach((item) => {
      if (!item.productId) {
        return;
      }
      const product = new Product();
      product.id = item.productId;
      product.price = item.price;
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
      // Process each line item in the request
      lineItems.forEach(
        (item: {
          product: { id: ObjectId; price: number };
          quantity: number;
        }) => {
          const existingItem = order.lineItems.find(
            (lineItem) => lineItem.productId === item.product.id
          );

          if (existingItem) {
            // Update the quantity if the product already exists
            existingItem.setQuantity(item.quantity);
          } else {
            // Add a new product if it doesn't exist
            const product = new Product();
            product.id = item.product.id;
            product.price = item.product.price;
            product.toJSON();
            order.addProduct(product, item.quantity);
          }
        }
      );

      // Remove line items that are not in the updated list
      order.lineItems.forEach((lineItem) => {
        const isInUpdatedList = lineItems.some(
          (item) => item.product.id === lineItem.productId
        );

        if (!isInUpdatedList) {
          order.removeLineItem(lineItem);
        }
      });
    }

    // Save the updated order to the database
    await order.save();

    // Respond with the updated order
    res.status(200).json(order);
  });
}
