import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express from 'express';
import cors from 'cors';
import { router as authRouter } from './routes/auth';
import { router as keysRouter } from './routes/keys';
import { router as solutionsRouter } from './routes/solutions';
import { router as projectsRouter } from './routes/projects';

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/keys', keysRouter);
app.use('/solutions', solutionsRouter);
app.use('/projects', projectsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
