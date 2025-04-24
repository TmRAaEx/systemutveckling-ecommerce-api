import { mongoDBClient } from "@config/database";
import DatabaseObject from "./DatabaseObject";

export default class Product extends DatabaseObject {
  constructor() {
    super();
  }

  public getName() {}
  public getPrice() {}
  public getImage() {}

  static async getAllProducts(): Promise<Product[]> {
    const items = await mongoDBClient.findAll("products");

    const products = items.map((data) => {
      let newProduct = new Product();

      //TODO add data

      return newProduct;
    });

    return products;
  }
}
