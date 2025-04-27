import { myCollections } from "@config/database";
import customerDetails from "@interfaces/Customer";
import LineItemsObject from "../base/LineItemsObject";
import LineItem from "@models/base/LineItem";

/**
 * Represents an order in the e-commerce system.
 */
export default class Order extends LineItemsObject {
  constructor() {
    super();
  }

  public customerDetails: customerDetails = {
    name: "",
    email: "",
  };

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

    // Ensure lineItems is properly populated
    if (Array.isArray(data.lineItems)) {
      this.lineItems = data.lineItems
        .map((item: any) => {
          if (!item.product) {
            console.warn("[Order]: Skipping line item with missing product.");
            return null;
          }

          // Use addProduct to add the product and quantity
          this.addProduct(item.product, item.quantity);
          return item; // Return the item for mapping
        })
        .filter((item) => item !== null); // Filter out null values
    } else {
      console.warn("[Order]: lineItems is not an array or is missing.");
      this.lineItems = [];
    }
  }

 
}
