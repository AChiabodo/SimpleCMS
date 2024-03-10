import express from "express";
import { getPlatforms } from "../controller/categories.js";
// Create a new Router object
const router = express.Router();

// Define routes for various HTTP methods and their corresponding functions
router.get("/", getPlatforms); // Get all gaming platforms

export default router;