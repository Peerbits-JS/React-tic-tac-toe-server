import express from "express";
import compression from "compression";
import helmet from "helmet";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import cors from "cors";

import { MONGODB_URI } from "./config/env";

// Controllers (route handlers)
import * as gameController from "./controllers/game";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = global.Promise;

mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
    })
    .catch((err) => {
        console.log(
            "MongoDB connection error. Please make sure MongoDB is running. " +
                err
        );
        process.exit(1);
    });

// Express configuration
app.set("port", process.env.PORT || 3000);
// app.set("views", path.join(__dirname, "../views"));
// app.set("view engine", "pug");
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);

/**
 * app routes.
 */
app.get("/game", gameController.getGame);
app.post("/game", gameController.postGame);
app.patch("/game/:id", gameController.patchGame);
app.get("/score", gameController.getScore);

export default app;
