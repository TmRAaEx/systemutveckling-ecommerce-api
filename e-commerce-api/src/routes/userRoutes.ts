import UserController from "@controllers/UserController";
import { Router } from "express";

const router = Router();
const userController = new UserController();

router.get("/", userController.getAll);

router.get("/:id", userController.getById);

export default router;
