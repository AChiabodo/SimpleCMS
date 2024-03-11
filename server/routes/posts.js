import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
  getDraftedPosts,
  getPostsNumber
} from "../controller/posts.js";

// Create a new Router object
const router = express.Router();

// Define routes for various HTTP methods and their corresponding functions
router.get("/", getPosts); // Get all posts
router.get("/drafts/:uid", getDraftedPosts); // Get all drafts
router.get("/number",getPostsNumber); // Get the number of posts (for pagination purposes)
router.get("/:id", getPost); // Get a specific post by its ID
router.post("/", addPost); // Add a new post
router.delete("/:id", deletePost); // Delete a post by its ID
router.put("/:id", updatePost); // Update a post by its ID
export default router;
