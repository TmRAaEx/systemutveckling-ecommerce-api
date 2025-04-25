//base file for routes

import ProductController from "@controllers/productController";
import { Router } from "express";

export const router = Router();

const productController = new ProductController();

router.get("/products/", productController.getAll);

router.get("/products/:id", productController.getById);

router.post("/products/create", productController.create);

router.patch("/products/update/:id", productController.update);

router.delete("/products/delete/:id", productController.delete);

//import other routes
