import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load environment variables from api/.env
dotenv.config({ path: path.resolve(__dirname, './.env') });

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import uploadRoute from './routes/upload.route.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/upload', uploadRoute);

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(8080, () => {
      console.log('🚀 Server running on port 8080');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
