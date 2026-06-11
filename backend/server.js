import "dotenv/config";
import dns from "dns";

// ── BOOTSTRAP: Environment Variables loaded via import ──
console.log(`🚀 BOOT: Environment loaded. NODE_ENV: ${process.env.NODE_ENV || "development"}`);

import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { initializeSocket } from "./socket.js";
import User from "./models/User.js";
import { seedAllData } from "./scripts/seedDatabase.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = (process.env.MONGODB_URI || process.env.MONGO_URI || "").trim();
const MONGODB_URI_FALLBACK = (process.env.MONGODB_URI_FALLBACK || "").trim();

console.log(`🚀 BOOT: Initializing server on port ${PORT}...`);

// Create the Node HTTP server from the configured Express app.
const server = http.createServer(app);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`❌ BOOT ERROR: Port ${PORT} is already in use`);
  } else {
    console.error("❌ BOOT ERROR:", error.message);
  }
  process.exit(1);
});

// Attach Socket.IO to the same HTTP server instance.
initializeSocket(server);

let mongodInstance = null;

const connectDB = async () => {
  const candidates = [MONGODB_URI, MONGODB_URI_FALLBACK].filter(Boolean);
  let lastError;

  if (candidates.length > 0) {
    for (const [index, uri] of candidates.entries()) {
      try {
        const isFallback = index > 0;
        console.log(`🔌 DB: Attempting connection${isFallback ? " (fallback)" : ""} to ${uri}...`);
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000
        });
        console.log(`✅ DB: Connected successfully${isFallback ? " using fallback URI" : ""}`);
        return true;
      } catch (error) {
        lastError = error;
        console.error(`❌ DB: Connection attempt ${index + 1} failed:`, error.message);
      }
    }
  } else {
    console.log("🔌 DB: No MongoDB URIs provided in environment.");
  }

  // Fallback to in-memory MongoDB Server
  try {
    console.log("🔌 DB: Starting in-memory MongoDB Server for DemoMart...");
    const { MongoMemoryServer } = await import("mongodb-memory-server");
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    console.log(`🔌 DB: In-memory MongoDB Server started. URI: ${memoryUri}`);

    await mongoose.connect(memoryUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ DB: Connected successfully to in-memory MongoDB");
    process.env.USING_IN_MEMORY_DB = "true";
    return true;
  } catch (error) {
    console.error("❌ DB: Failed to start or connect to in-memory MongoDB:", error.message);
    throw lastError || error;
  }
};

const cleanup = async () => {
  if (mongodInstance) {
    console.log("🔌 DB: Stopping in-memory MongoDB Server...");
    await mongodInstance.stop();
  }
};

process.on("SIGINT", async () => {
  await cleanup();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await cleanup();
  process.exit(0);
});

const boot = async () => {
  try {
    console.log("🚀 BOOT: Connecting to database...");
    await connectDB();

    // Check if seeding is needed
    const adminExists = await User.findOne({ isAdmin: true });
    const isInMemory = process.env.USING_IN_MEMORY_DB === "true";
    if (!adminExists || isInMemory) {
      console.log("🌱 BOOT: Seeding database defaults (DemoMart products, admin, coupons, slides)...");
      await seedAllData();
      console.log("✅ BOOT: Seeding complete!");
    } else {
      console.log("🌱 BOOT: Database already has admin data. Skipping auto-seeding.");
    }

    // Start accepting HTTP and Socket.IO traffic.
    server.listen(PORT, () => {
      console.log(`✅ BOOT: Server listening on port ${PORT}`);
      console.log("🚀 BOOT: DemoMart Backend is READY");
    });
  } catch (error) {
    console.error("❌ BOOT CRITICAL FAILURE:", error.message);
    await cleanup();
    process.exit(1);
  }
};

boot();
