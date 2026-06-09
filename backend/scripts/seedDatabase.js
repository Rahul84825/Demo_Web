import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import HeroSlide from "../models/HeroSlide.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const DATABASE_URI = process.env.MONGODB_URI;

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@AppData\\\\Local\\\\Microsoft\\\\OneDrive\\\\logs\\\\Personal\\\\SyncEngine-2026-06-09.0815.10112.123.odl";

const categories = [
  { name: "Electronics", slug: "electronics", is_active: true, showInNavbar: true },
  { name: "Fashion", slug: "fashion", is_active: true, showInNavbar: true },
  { name: "Home Decor", slug: "home-decor", is_active: true, showInNavbar: true },
  { name: "Accessories", slug: "accessories", is_active: true, showInNavbar: true },
  { name: "Sports", slug: "sports", is_active: true, showInNavbar: true }
];

const products = [
  { name: "Wireless Headphones", category: "Electronics", price: 2999 },
  { name: "Smartwatch", category: "Electronics", price: 1999 },
  { name: "4K Television", category: "Electronics", price: 45000 },
  { name: "Bluetooth Speaker", category: "Electronics", price: 1500 },
  { name: "Men's Casual Shirt", category: "Fashion", price: 899 },
  { name: "Women's Summer Dress", category: "Fashion", price: 1299 },
  { name: "Running Shoes", category: "Fashion", price: 2499 },
  { name: "Leather Wallet", category: "Fashion", price: 599 },
  { name: "Ceramic Vase", category: "Home Decor", price: 399 },
  { name: "Wall Clock", category: "Home Decor", price: 799 },
  { name: "Cotton Bedsheet", category: "Home Decor", price: 1100 },
  { name: "Table Lamp", category: "Home Decor", price: 650 },
  { name: "Polarized Sunglasses", category: "Accessories", price: 1200 },
  { name: "Silver Necklace", category: "Accessories", price: 1800 },
  { name: "Classic Wristwatch", category: "Accessories", price: 2500 },
  { name: "Leather Belt", category: "Accessories", price: 450 },
  { name: "Yoga Mat", category: "Sports", price: 900 },
  { name: "Dumbbell Set", category: "Sports", price: 3500 },
  { name: "Tennis Racket", category: "Sports", price: 2100 },
  { name: "Skipping Rope", category: "Sports", price: 300 }
];

const demoProducts = products.map((p, i) => ({
  name: p.name,
  category: p.category,
  description: \`High quality \${p.name.toLowerCase()} for all your needs.\`,
  image: "https://via.placeholder.com/400?text=" + encodeURIComponent(p.name),
  gstPercent: 18,
  packingCharges: 50,
  variants: [
    {
      label: "Standard",
      mrp: p.price + 500,
      sellingPrice: p.price,
      finalPrice: p.price,
      stock: 100,
      isAvailable: true
    }
  ],
  isAvailable: true
}));

const coupons = [
  { code: "WELCOME50", discountType: "FLAT", discountValue: 50, minOrderAmount: 500, isActive: true },
  { code: "SAVE10", discountType: "PERCENTAGE", discountValue: 10, minOrderAmount: 1000, isActive: true }
];

const heroSlides = [
  { title: "Welcome to DemoMart", subtitle: "Best Deals Online", description: "Find the best products at the lowest prices.", image: "https://via.placeholder.com/1200x400?text=Hero+Banner+1", isActive: true },
  { title: "Summer Collection", subtitle: "Up to 50% Off", description: "Upgrade your wardrobe with our latest fashion trends.", image: "https://via.placeholder.com/1200x400?text=Hero+Banner+2", isActive: true }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(DATABASE_URI);
    console.log("Connected to MongoDB.");

    // Clear existing
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await HeroSlide.deleteMany({});

    // Admin
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({ name: "Demo Admin", email: ADMIN_EMAIL, password: hashedPassword, isAdmin: true });
    console.log("Admin seeded.");

    // Categories
    await Category.insertMany(categories);
    console.log("Categories seeded.");

    // Products
    await Product.insertMany(demoProducts);
    console.log("Products seeded.");

    // Coupons
    await Coupon.insertMany(coupons);
    console.log("Coupons seeded.");

    // Hero Slides
    await HeroSlide.insertMany(heroSlides);
    console.log("Hero Slides seeded.");

    console.log("Database seeding completed successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDatabase();