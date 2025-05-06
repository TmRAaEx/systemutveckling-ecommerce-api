import Cart from "@models/entities/Cart";
import BaseController from "./BaseController";
import Product from "@models/entities/Product";
import { mongoDBClient } from "@config/database";

export default class CartController extends BaseController {
  public getById = this.handle(async (req, res) => {
    const { id } = req.params;
    const cart = await this.createInstance(id, Cart);
    cart.lineItems.forEach((item) => {
      if (!item.productId) {
        return;
      }
      const product = new Product();
      product.id = item.productId;
      cart.addProduct(product, item.quantity);
    });
    res.status(200).json(cart);
  });

  public create = this.handle(async (req, res) => {
    const { lineItems, userId }: { lineItems: any[]; userId: string } =
      req.body;

    const cart = new Cart();
    cart.user = mongoDBClient.toObjectId(userId);
    for (const item of lineItems) {
      if (!item.product.id) {
        continue;
      }
      const product = new Product();
      product.id = item.product.id;
      product.price = item.product.price;
      cart.addProduct(product, item.quantity);
    }
    await cart.save();

    res.status(201).json(cart);
  });

  public update = this.handle(async (req, res) => {
    const { id } = req.params;
    const { linetItems } = req.body;
  });
}
