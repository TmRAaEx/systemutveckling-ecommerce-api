import UserController from "@controllers/UserController";
import { Router } from "express";

const router = Router();
const userController = new UserController();

router.get("/", userController.getAll);

router.get("/:id", userController.getById);

router.post("/create", userController.create)
router.post("/signin", userController.signIn)

export default router;
