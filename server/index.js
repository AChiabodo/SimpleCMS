import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import categoryRoutes from "./routes/categories.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import cors from "cors";
import env from "dotenv";

const result = env.config();
// Create an instance of the Express application
const app = express();

// Use the built-in JSON middleware to parse incoming requests
app.use(express.json());
// Use the cookieParser middleware to parse cookies from incoming requests
app.use(cookieParser());

app.use('/', express.static('dist'));

// set-up the CORS middleware
const corsOptions = {
  origin: result.parsed.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
};

app.use(cors(corsOptions));

// Configuration object for setting destination and filename for the uploaded file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder where the uploaded file should be stored
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    // Set the filename of the uploaded file

    cb(null, Date.now() + file.originalname);
  },
});

// Set up multer middleware with the defined storage configuration
const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));
app.use('/', express.static('dist'));

// Set up a POST endpoint for handling file uploads
app.post("/api/upload", upload.single("file"), function (req, res) {
  // Get the uploaded file
  const file = req.file;
  console.log(file);
  // Send a response with the filename of the uploaded file
  res.status(200).json(file.filename);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
// Start the server and listen on port 3001
app.listen(3001, () => {
  console.log("Connected...");
});
