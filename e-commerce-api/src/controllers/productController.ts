import Product from "@models/Product";
import BaseController from "./BaseController";
import { mongoDBClient } from "@config/database";

/**
 * ProductController handles all operations related to products,
 * including fetching, creating, updating, and retrieving products by ID.
 * It extends the BaseController to provide error handling for asynchronous operations.
 */
export default class ProductController extends BaseController {
  /**
   * Handles GET requests to fetch all products.
   * Responds with a list of all products in the database.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  public getAll = this.handle(async (req, res) => {
    const products = await Product.getAll();
    res.status(200).json(products);
  });

  /**
   * Handles GET requests to fetch a product by its ID.
   * Responds with the product details if found.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  public getById = this.handle(async (req, res) => {
    const { id } = req.params;
    const product = await ProductController.createProductInstance(id);

    res.status(200).json(product);
  });

  /**
   * Handles PUT requests to update an existing product.
   * Updates the product with the provided data and responds with the updated product.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  public update = this.handle(async (req, res) => {
    const { id } = req.params;
    const { name, price, image, description } = req.body;

    const product = await ProductController.createProductInstance(id);

    product.price = price;
    product.name = name;
    product.image = image;
    product.description = description;
    await product.save();

    res.status(200).json(product);
  });

  /**
   * Handles POST requests to create a new product.
   * Creates a new product with the provided data and responds with the created product.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  public create = this.handle(async (req, res) => {
    const { name, price, image, description } = req.body;
    const product = new Product();

    product.price = price;
    product.name = name;
    product.image = image;
    product.description = description;
    await product.save();

    res.status(201).json(product);
  });

  /**
   * Helper function to create and load a product instance by its ID.
   *
   * @param id - The product ID as a string.
   * @returns A loaded Product instance.
   * @throws Will throw an error if the product cannot be found or loaded.
   */
  static async createProductInstance(id: string): Promise<Product> {
    const product = new Product();
    product.id = mongoDBClient.toObjectId(id);
    await product.load();
    return product;
  }
}
