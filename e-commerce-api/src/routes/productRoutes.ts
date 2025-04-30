import ProductController from "@controllers/ProductController";
import { Router } from "express";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getAll);

router.get("/search", productController.getBySearch);

router.get("/:id", productController.getById);

router.post("/create", productController.create);

router.patch("/update/:id", productController.update);

router.delete("/delete/:id", productController.delete);



export default router;
