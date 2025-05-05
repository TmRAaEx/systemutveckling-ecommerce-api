import CategoryController from "@controllers/CategoryController";
import { Router } from "express";

const router = Router();
const categoryController = new CategoryController();
router.get("/", categoryController.getAll);
router.post("/:id", categoryController.getById);

export default router;
