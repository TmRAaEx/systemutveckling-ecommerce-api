import { myCollections } from "@config/database";
import DatabaseObject from "./DatabaseObject";

/**
 * Represents a category in the e-commerce system.
 * Categories can have subcategories, forming a hierarchical structure.
 */
export default class Category extends DatabaseObject {
  public name: string = "";
  public description: string = "";
  public subCats: Category[] = [];

  /**
   * Initializes a new instance of the Category class.
   */
  constructor() {
    super();
  }

  /**
   * Retrieves the name of the database collection for categories.
   * 
   * @returns {myCollections["collectionName"]} The name of the collection ("categories").
   */
  public getCollection(): myCollections["collectionName"] {
    return "categories";
  }

  /**
   * Maps database data to the category instance.
   * 
   * @param data - The raw database document.
   */
  public setupFromDatabase(data: Record<string, any>): void {
    this.name = data.name;
    this.description = data.description;
    this.subCats = data.subCats;
  }
}
