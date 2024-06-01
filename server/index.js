import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { createPost } from "./controllers/posts.js";
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";

/* CONFIGURATIONS */

const __filename = fileURLToPath(import.meta.url); //It represents the absolute path of the current module file.
const __dirname = path.dirname(__filename); //It represents the absolute path of the directory containing the current module file.

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet()); //for security
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); //sets up a route that serves as static files

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, "public/assets");
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES*/
app.post("/auth/register", upload.single("picture"), register); //uploads pictures locally
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP*/
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true, //is for using the new URL parser
    useUnifiedTopology: true, // is for using the new Server Discovery and Monitoring engine.
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Post: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
