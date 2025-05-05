import Category from "@models/entities/Category";
import BaseController from "./BaseController";

export default class CategoryController extends BaseController {
  public getAll = this.handle(async (req, res) => {
    const categories = await Category.getAll();
    res.status(200).json(categories);
  });

  public getById = this.handle(async (req, res) => {
    const { id } = req.params;

    const category = await this.createInstance(id, Category);
    res.status(200).json(category);
  });
}
