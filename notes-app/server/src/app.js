import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from "./routes/note.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);

app.use("/api/notes", noteRoutes);

// (notes routes will be added in Week 2)
app.use(errorHandler);

export default app;



