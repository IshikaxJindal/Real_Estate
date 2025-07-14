import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log(' Connected to MongoDB');
    app.listen(8080, () => {
      console.log(' Server running on port 8080');
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
  });
