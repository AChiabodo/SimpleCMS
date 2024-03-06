import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import categoryRoutes from "./routes/categories.js";
import cookieParser from "cookie-parser";
import multer from "multer";
import cors from "cors";
import env from "dotenv";
import https from "https";
import fs from "fs";
import path from "path";

// Load ports from the .env file
const httpsPort = process.env.HTTPS_PORT || 1337;
const httpPort = process.env.HTTP_PORT || 3001;

// Load environment variables from the .env file
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
 origin: [
    result.parsed.CORS_ORIGIN || 'http://localhost:3001',
    result.parsed.HTTPS_CORS_ORIGIN || 'https://localhost:1337'
 ],
 credentials: true,
};

app.use(cors(corsOptions));
console.log('CORS_ORIGIN: ' + corsOptions.origin);
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
app.listen(httpPort, () => {
  console.log("Unsecure API server Listening on port " + httpPort);
});

/* Setup the TLS certificates and connection*/
let urlConfig = {};
urlConfig.SSL_KEY = result.parsed.SSL_KEY || './cert/key.pem';
urlConfig.SSL_CERT = result.parsed.SSL_CERT || './cert/cert.pem';

const options = {
  key:fs.readFileSync('./cert/key.pem'),
  cert:fs.readFileSync('./cert/cert.pem')
  }
const sslServer=https.createServer(options,app);
  sslServer.listen(1337,()=>{
    console.log('API server listening on port ' + httpsPort + ' (SSL Connection)');
  })

/*
let urlConfig = {};
urlConfig.SSL_KEY = "/etc/ssl/PATH/example.key";
urlConfig.SSL_CERT = "/etc/ssl/PATH/STAR_example_com.crt";
urlConfig.SSL_CA = "/etc/ssl/PATH/STAR_example_com.ca-bundle";var app = express();
var fs = require('fs');
var appPort = 5000;
var appPortHttps = 5001; //for SSL. yes!! we can use different port for SSL other then 443.// SSL Configuration
if (urlConfig.SSL_KEY != "") {
 let key = fs.readFileSync(urlConfig.SSL_KEY);
 let cert = fs.readFileSync(urlConfig.SSL_CERT);
 let ca = fs.readFileSync(urlConfig.SSL_CA);
let options = {
 key: key,
 cert: cert,
 ca: ca
 };
let https = require('https').Server(options, app);
 https.listen(appPortHttps, function () {
 console.log('API server listening on port ' + appPortHttps + ' (SSL Connection)');
 });
}
// SSL Configuration ends // Normal HTTP configuration
let http = require('http').Server(app);
http.listen(appPort, function() {
 console.log('API server listening on port ' + appPort);
});
// Normal HTTP configuration ends
*/