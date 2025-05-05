import { myCollections } from "@config/database";
import LineItemsObject from "../base/LineItemsObject";
import User from "./User";

export default class Cart extends LineItemsObject {
  public user: User["id"] = null;
  constructor() {
    super();
  }

  public getCollection(): myCollections["collectionName"] {
    return "carts";
  }

  public setupFromDatabase(data: Record<string, any>): void {
    this.user = data.user;
    this.lineItems = data.lineItems
      .map((item: any) => {
        if (!item.productId) {
          console.warn("[Cart]: Skipping line item with missing product.");
          return null;
        }

        // Use addProduct to add the product and quantity
        this.addProduct(item.product, item.quantity);
        return item; // Return the item for mapping
      })
      .filter((item: any) => item !== null); // Filter out null values
  }
}
