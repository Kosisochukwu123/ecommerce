import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectProductsDB } from "./config/db.js";
import getProductModel from "./models/Product.js";

dotenv.config();


// Your existing products - converted to work with MongoDB
const seedProducts = [
  {
    name: "Men Classy Hoodies",
    category: "hoodies",
    image: "/images/Top-Piece2.png",
    images: [],
    rating: { stars: 4.2, count: 120 },
    priceCents: 15990,
    discountCents: null,
    keywords: ["t-shirt", "clothing", "casual"],
    description: "",
    stock: 50,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy"],
    brand: "",
    isActive: true,
  },
  {
    name: "Black Cartoon Shirt",
    category: "t-shirt",
    image: "/images/mens-top1.png",
    images: [],
    rating: { stars: 4.7, count: 250 },
    priceCents: 19990,
    discountCents: null,
    keywords: ["jeans", "pants", "denim"],
    description: "",
    stock: 30,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    brand: "",
    isActive: true,
  },
  {
    name: "Brown Cartoon Shirt",
    category: "t-shirt",
    image: "/images/mens-top2.png",
    images: ["/img/shirt1.png", "/img/shirt2.png", "/img/shirt3.png"],
    rating: { stars: 4.6, count: 180 },
    priceCents: 4999,
    discountCents: 3999,
    keywords: ["shirt", "cartoon", "brown", "men fashion"],
    description: "A soft cotton cartoon shirt perfect for casual outings.",
    stock: 25,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black", "White"],
    brand: "Nike",
    isActive: true,
  },
];

const seed = async () => {
  try {
    // Connect to Products database only
    await connectProductsDB();

    const Product = getProductModel();

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Insert all products
    const inserted = await Product.insertMany(seedProducts);
    console.log(`✅ Successfully added ${inserted.length} products to MongoDB!\n`);

    // Show what was added
    inserted.forEach((p, i) => {
      console.log(`   ${i + 1}. [${p._id}] ${p.name} - $${(p.priceCents / 100).toFixed(2)}`);
    });

    console.log("\n🎉 All done! Your products are now in MongoDB.");
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from database");
    process.exit(0);
  }
};

seed();