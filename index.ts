import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import { httpLogger } from './src/utils/logger';
import errorMiddleware from './src/middlewares/error.middleware';

require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// Use basic middleware library
app.use(helmet());
app.use(cors({ credentials: true }));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 2 * 1024 * 1024 },
  }),
);
app.use(express.urlencoded({ extended: true }));

// Use HTTP logger
app.use(httpLogger);

require('./src/modules')(app);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});
