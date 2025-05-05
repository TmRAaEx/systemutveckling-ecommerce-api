import { myCollections } from "@config/database";
import DatabaseObject from "../base/DatabaseObject";

import Category from "./Category";
import { ObjectId } from "mongodb";

/**
 * Represents a product in the e-commerce system.
 */
export default class Product extends DatabaseObject {
  public price: number = 0;
  public name: string = "";
  public image: string = "";
  public description: string = "";
  public category: Category | null | ObjectId = null;

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
  public async setupFromDatabase(data: Record<string, any>): Promise<void> {
    this.price = data.price || 0;
    this.name = data.name || "";
    this.image = data.image || "";
    this.description = data.description || "";
    this.category = new Category();
    this.category.id = data.category;
    await this.category.load();
  }
}
