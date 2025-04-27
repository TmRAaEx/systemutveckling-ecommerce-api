import Product from "../entities/Product";

export default class LineItem {
  public productId: Product["id"] | null = null;
  public quantity: number = 0;
  public price: number = 0;

  constructor(productId: Product["id"], quantity: number, price: number) {
    this.productId = productId;
    this.quantity = quantity;
    this.price = this.price;
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
