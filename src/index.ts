import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import errorMiddleware from "./middlewares/error.middleware";
import { httpLogger } from "./utils/logger";

//import * as middlewares from "./middlewares";
//import api from "./modules";
//import MessageResponse from "./interfaces/MessageResponse";

require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;

// Use basic middleware library
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use HTTP logger
app.use(httpLogger);

require("./modules")(app);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
