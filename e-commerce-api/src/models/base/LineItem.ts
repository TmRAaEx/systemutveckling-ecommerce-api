import Product from "../entities/Product";

export default class LineItem {
  public product: Product | null = null;
  public quantity: number = 0;
  public price: number = 0;

  constructor(product: Product, quantity: number, price: number) {
    this.product = product;
    this.quantity = quantity;
    this.price = this.price;
  }

  public setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  public toJSON() {
    return {
      product: this.product,
      quantity: this.quantity,
      price: this.price,
    };
  }
}
