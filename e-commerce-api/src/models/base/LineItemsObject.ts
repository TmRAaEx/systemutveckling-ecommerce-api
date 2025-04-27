import DatabaseObject from "./DatabaseObject";
import LineItem from "./LineItem";
import Product from "../entities/Product";

export default class LineItemsObject extends DatabaseObject {
  public lineItems: LineItem[] = [];

  constructor() {
    super();
  }

  public addProduct(product: Product, quantity: number) {
    const existingItem = this.lineItems.find(
      (item) => item.productId === product.id
    );
    if (existingItem) {
      existingItem.setQuantity(existingItem.quantity + quantity);
      return existingItem;
    }

    const newLineItem = new LineItem(product.id, quantity, product.price);
    this.lineItems.push(newLineItem);
    return newLineItem;
  }

  /**
   * Function that removes a specified line item from the current object
   * @param lineItem The lineitem to remove
   */
  public removeLineItem(lineItem: LineItem) {
    this.lineItems = this.lineItems.filter((item) => item !== lineItem);
  }
}
