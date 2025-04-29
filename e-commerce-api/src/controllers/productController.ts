import Product from "@models/entities/Product";
import BaseController from "./BaseController";

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

  public getBySearch = this.handle(async (req, res) => {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : "";
    const filter = {
      $or: [
        { name: { $regex: searchString, $options: "i" } }, // Case-insensitive search in the name field
        { description: { $regex: searchString, $options: "i" } }, // Case-insensitive search in the description field
      ],
    };
    const products = await Product.getAll(filter);
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
    const product = await this.createInstance(id, Product);
    res.status(200).json(product);
  });

  /**
   * Handles PUT & PATCH requests to update an existing product.
   * Updates the product with the provided data and responds with the updated product.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  public update = this.handle(async (req, res) => {
    const { id } = req.params;
    const { name, price, image, description, category } = req.body;

    const product = await this.createInstance(id, Product);

    product.price = price;
    product.name = name;
    product.image = image;
    product.description = description;
    product.category = category;
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
    const { name, price, image, description, category } = req.body;
    const product = new Product();

    if (!name || !price || !image || !description) {
      console.error(
        "All fields: [name], [price], [image], [description] must be filled"
      );

      res
        .status(400)
        .json({ error: "Missing fields name, price, image or description" });
      return;
    }

    product.price = price;
    product.name = name;
    product.image = image;
    product.description = description;
    product.category = category;
    await product.save();

    res.status(201).json(product);
  });

  /**
   * Handles DELETE requests to delete a product.
   * Deletes the product specified by the id param
   * @param req - The Express request object.
   * @param res - The Express response object.
   */
  public delete = this.handle(async (req, res) => {
    const { id } = req.params;

    const product = await this.createInstance(id, Product);

    await product.delete();
    res.status(204);
  });
}
