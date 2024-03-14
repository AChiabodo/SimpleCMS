import express from "express";
import { getReviewCategories,getPlatforms, getNewsCategories } from "../controller/categories.js";
// Create a new Router object
const router = express.Router();

// Define routes for various HTTP methods and their corresponding functions
router.get("/reviews", getReviewCategories); // Get all categories
router.get("/platforms", getPlatforms); // Get all gaming platforms
router.get("/news", getNewsCategories); // Get all news categories

export default router;