import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import client from 'prom-client';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

client.collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

console.log(`App starting with NODE_ENV=${process.env.NODE_ENV}`);

// Connexion à la base de données
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'product-service' });
});

if (process.env.NODE_ENV !== 'test') {
  app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        service: 'order-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
  });
  app.listen(port, () => {
    console.log(`Product service running on port ${port}`);
  });
}

export default app;
