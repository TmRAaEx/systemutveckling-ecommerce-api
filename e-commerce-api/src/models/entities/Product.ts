import { myCollections } from "@config/database";
import DatabaseObject from "../base/DatabaseObject";
import { ObjectId } from "mongodb";

/**
 * Represents a product in the e-commerce system.
 */
export default class Product extends DatabaseObject {
  public price: number = 0;
  public name: string = "";
  public image: string = "";
  public description: string = "";
  public category: ObjectId = new ObjectId();

  constructor() {
    super();
  }

  /**
   * Retrieves the name of the database collection for products.
   * @returns {myCollections["collectionName"]} The name of the collection ("products").
   */
  public getCollection(): myCollections["collectionName"] {
    return "products";
  }

  /**
   * Maps database data to the product instance.
   * @param data The raw database document.
   */
  public setupFromDatabase(data: Record<string, any>): void {
    this.price = data.price || 0;
    this.name = data.name || "";
    this.image = data.img_url || "";
    this.description = data.description || "";
    this.category = data.category;
  }
}
