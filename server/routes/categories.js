import express from "express";
import { getReviewCategories,getPlatforms } from "../controller/categories.js";
// Create a new Router object
const router = express.Router();

// Define routes for various HTTP methods and their corresponding functions
router.get("/reviews", getReviewCategories); // Get all categories
router.get("/platforms", getPlatforms); // Get all gaming platforms

export default router;