import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";

import authRoute from "./routes/auth.js";
import postRoute from "./routes/posts.js";
import commentsRoute from "./routes/coment.js";

const app = express();
dotenv.config();

const DB_LINK = process.env.DB_LINK;

//Middlware
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.static("uploads"));

//Routes

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/coments", commentsRoute);

async function start() {
    try {
        await mongoose.connect(DB_LINK);

        app.listen(process.env.PORT, () => console.log(`Server started on port:`));
    } catch (error) {
        console.log(error);
    }
}

start();
