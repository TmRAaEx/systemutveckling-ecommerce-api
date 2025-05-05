import { ObjectId } from "mongodb";
import { mongoDBClient, myCollections } from "@config/database";
import DatabaseObject from "../base/DatabaseObject";

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
   * Override the default load function
   */
  public async load(): Promise<void> {
    const collectionName = this.getCollection();
    if (!collectionName || !this.id) {
      console.warn("[Category]: No collection name or id provided.", this);
      return; // Exit early if collection name or id is null
    }

    try {
      // Perform the query to find the category or subcategory
      const results = await mongoDBClient.findAll(collectionName, {
        $or: [
          { _id: this.id }, // Match the category by its ID
          { "subCats._id": this.id }, // Match subcategories by their ID
        ],
      });


      if (results.length > 0) {
        const data = results[0];

        // If the category is found, map the data to the instance
        this.setupFromDatabase(data);

        // If the category is found as a subcategory, extract its details
        if (!data._id.equals(this.id)) {
          const subCategory = data.subCats.find(
            (subCat: any) => subCat._id.toString() === this.id?.toString()
          );
          if (subCategory) {
            this.setupFromDatabase(subCategory);
          }
        }
      } else {
        console.warn(
          "[Category]: No category or subcategory found with the given ID.",
          this.id
        );
      }
    } catch (error) {
      console.error("[Category]: Error loading category:", error);
    }
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
