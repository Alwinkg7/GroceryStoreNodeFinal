import express from "express";
import { getUsers, getUserById, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);        // List all users
router.get("/:id", getUserById);  // Get user by ID
router.delete("/:id", deleteUser); // Delete user

export default router;
