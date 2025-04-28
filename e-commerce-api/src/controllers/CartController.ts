import Cart from "@models/entities/Cart";
import BaseController from "./BaseController";
import Product from "@models/entities/Product";

export default class CartController extends BaseController {
  public getById = this.handle(async (req, res) => {
    const { id } = req.params;
    const cart = await this.createInstance(id, Cart);
    cart.lineItems.forEach((item) => {
      if (!item.product) {
        return;
      }
      const product = new Product();
      product.id = item.product.id;
      cart.addProduct(product, item.quantity);
    });
    res.status(200).json(cart);
  });

  public create = this.handle(async (req, res) => {
    const { lineItems } = req.body;
    const cart = new Cart();

    for (const item of lineItems) {
      if (!item.product) {
        continue;
      }
      const product = await this.createInstance(item.product.id, Product);
      product.price = item.product.price;
      cart.addProduct(product, item.quantity);
    }

    await cart.save();

    res.status(201).json(cart);
  });
}
