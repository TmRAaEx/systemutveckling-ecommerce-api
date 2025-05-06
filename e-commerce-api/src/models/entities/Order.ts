import { myCollections } from "@config/database";
import customerDetails from "@interfaces/Customer";
import LineItemsObject from "../base/LineItemsObject";

/**
 * Represents an order in the e-commerce system.
 */
export default class Order extends LineItemsObject {
  constructor() {
    super();
  }

  public customerDetails: customerDetails = {
    firstname: "",
    lastname: "",
    email: "",
    address: "",
  };

  public payment_ref: string = "";

  /**
   * Retrieves the name of the database collection for orders.
   * @returns {myCollections["collectionName"]} The name of the collection ("orders").
   */
  public getCollection(): myCollections["collectionName"] {
    return "orders";
  }

  /**
   * Maps database data to the product instance.
   * @param data The raw database document.
   */
  public setupFromDatabase(data: Record<string, any>): void {
    // Set customer details
    this.customerDetails = data.customerDetails;
    this.payment_ref = data.payment_ref;


    this.lineItems = data.lineItems
      .map((item: any) => {
        if (!item.productId) {
          console.warn("[Order]: Skipping line item with missing product.");
          return null;
        }

        // Use addProduct to add the product and quantity
        this.addProduct(item.product, item.quantity);
        return item; // Return the item for mapping
      })
      .filter((item: any) => item !== null); // Filter out null values
  }
}
