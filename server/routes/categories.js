import express from "express";
import { getCategories } from "../controller/categories.js";
// Create a new Router object
const router = express.Router();

// Define routes for various HTTP methods and their corresponding functions
router.get("/", getCategories); // Get all categories

export default router;