// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express(); // ← initialize express app

// For dev, allow all origins
app.use(cors());
app.use(express.json());

// --- Mongo Connect ---
const { MONGODB_URI, PORT = 5002 } = process.env;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is missing in .env file');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    seedProductsIfEmpty(); // seed on first run
  })
  .catch((err) => console.error('Mongo error:', err));

// --- Schemas & Models ---
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);
const Product = mongoose.model('Product', ProductSchema);

const RatingSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    stars: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);
const Rating = mongoose.model('Rating', RatingSchema);

// --- Seed sample products if empty ---
async function seedProductsIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return;

  const sample = [
    {
      title: 'Elegant Hijab',
      price: 1999,
      description: 'Soft chiffon hijab with elegant drape.',
      image: 'https://picsum.photos/seed/hijab1/600/400',
    },
    {
      title: 'Casual Scarf',
      price: 1299,
      description: 'Everyday comfy cotton scarf.',
      image: 'https://picsum.photos/seed/hijab2/600/400',
    },
    {
      title: 'Luxury Satin Hijab',
      price: 2499,
      description: 'Shiny satin finish for special occasions.',
      image: 'https://picsum.photos/seed/hijab3/600/400',
    },
  ];
  await Product.insertMany(sample);
  console.log(`🌱 Seeded ${sample.length} products`);
}

// --- Helpers ---
async function getRatingStats(productId) {
  const agg = await Rating.aggregate([
    { $match: { productId: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$productId',
        avgStars: { $avg: '$stars' },
        count: { $sum: 1 },
      },
    },
  ]);
  const stats = agg[0] || { avgStars: 0, count: 0 };
  return { average: Number(stats.avgStars?.toFixed?.(2) || 0), count: stats.count };
}

// --- Routes ---
app.get('/api/health', (req, res) => res.json({ ok: true }));

// All products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Single product + rating stats
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const stats = await getRatingStats(product._id);
    res.json({ product, ratings: stats });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// All ratings for a product
app.get('/api/products/:id/ratings', async (req, res) => {
  try {
    const list = await Rating.find({ productId: req.params.id })
      .sort({ createdAt: -1 })
      .lean();
    const stats = await getRatingStats(req.params.id);
    res.json({ ratings: list, ...stats });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Post a rating
app.post('/api/products/:id/ratings', async (req, res) => {
  try {
    const { stars, comment = '' } = req.body;
    if (!stars || stars < 1 || stars > 5) {
      return res.status(400).json({ error: 'stars must be 1-5' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await Rating.create({ productId: product._id, stars, comment });
    const stats = await getRatingStats(product._id);
    res.status(201).json({ message: 'Rating saved', ratings: stats });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
