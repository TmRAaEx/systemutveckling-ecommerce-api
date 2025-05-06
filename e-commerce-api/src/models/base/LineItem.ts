import Product from "../entities/Product";

export default class LineItem {
  public productId: Product["id"] | null = null;
  public quantity: number = 0;
  public price: number = 0;

  constructor(product: Product, quantity: number) {
    this.productId = product.id;
    this.quantity = quantity;
    this.price = product.price;
  }

  public setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  public toJSON() {
    return {
      productId: this.productId,
      quantity: this.quantity,
      price: this.price,
    };
  }
}
