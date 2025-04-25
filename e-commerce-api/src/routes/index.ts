//base file for routes

import ProductController from "@controllers/productController";
import UserController from "@controllers/UserController";
import { Router } from "express";

export const router = Router();

const productController = new ProductController();
const userController = new UserController();

router.get("/products/", productController.getAll);

router.get("/products/:id", productController.getById);

router.post("/products/create", productController.create);

router.patch("/products/update/:id", productController.update);

router.delete("/products/delete/:id", productController.delete);

router.get("/users/", userController.getAll);

//import other routes
