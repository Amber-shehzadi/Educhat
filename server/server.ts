require("dotenv").config();
import http from "http";
import { app } from "./app";
import { v2 as cloudinary } from "cloudinary";
import handleDBConnection from "./connection/db";
import { initSocketServer } from "./socketServer";
const server = http.createServer(app);

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

initSocketServer(server);

// create server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
  handleDBConnection();
});
