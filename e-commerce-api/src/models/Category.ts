import { myCollections } from "@config/database";
import DatabaseObject from "./DatabaseObject";

export default class Category extends DatabaseObject {
  public name: string = "";
  public description: string = "";
  public subCats: Category[] = [];

  constructor() {
    super();
  }

  public getCollection(): myCollections["collectionName"] {
    return "categories";
  }

  public setupFromDatabase(data: Record<string, any>): void {
    this.name = data.name;
    this.description = data.description;
    this.subCats = data.subCats;
  }
}
