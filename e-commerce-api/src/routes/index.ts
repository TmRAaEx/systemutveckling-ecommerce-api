//base file for routes
import { mongoDBClient } from "@config/database";
import ProductController from "@controllers/productController";
import Product from "@models/Product";
import { Router, Request, Response } from "express";

export const router = Router();

const productController = new ProductController();

router.get("/products/", productController.getAll);

router.get("/products/:id", productController.getById);

//import other routes
