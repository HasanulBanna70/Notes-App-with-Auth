import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

connectDB().then(() => {
  app.listen(env.port, () => console.log(`🚀 Server on http://localhost:${env.port}`));
}).catch((err) => {
  console.error('DB connect failed:', err);
  process.exit(1);
});
