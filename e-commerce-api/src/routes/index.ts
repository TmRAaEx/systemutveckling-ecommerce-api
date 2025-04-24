//base file for routes
import { mongoDBClient } from "@config/database";
import Product from "@models/Product";
import { Router, Request, Response } from "express";
export const baseRoutes = Router();

baseRoutes.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeSctipt");
});

//TODO refactor to a controller
baseRoutes.get("/products/", async (req: Request, res: Response) => {
  let products = await Product.getAll();
  res.send(products);
});

baseRoutes.get("/products/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  let product = new Product();
  product.id = mongoDBClient.toObjectId(id);
  await product.load();
  res.send(product);
});

//import other routes
