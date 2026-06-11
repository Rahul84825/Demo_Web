// DEMO MODE — replace with real API endpoint before production
import { demoDb } from "../demo/demoDb";

const simulateDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const demoAdapter = async (config) => {
  // Simulate network delay between 300ms and 800ms
  const delay = Math.floor(Math.random() * (800 - 300 + 1)) + 300;
  await simulateDelay(delay);

  // Clean the URL by removing baseUrl and query string for matching
  let url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  
  // Parse query params if it's a GET request
  const queryIndex = url.indexOf("?");
  let path = queryIndex !== -1 ? url.substring(0, queryIndex) : url;
  
  // Normalize paths starting with slash or absolute paths
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const urlObj = new URL(path);
    path = urlObj.pathname;
  }
  
  let data = null;
  let status = 200;

  try {
    let body = {};
    if (config.data) {
      try {
        body = typeof config.data === "string" ? JSON.parse(config.data) : config.data;
      } catch (e) {
        body = config.data;
      }
    }

    console.log(`📡 [DEMO MOCK API] ${method.toUpperCase()} ${path}`, { body, params: config.params });

    // 1. AUTH ENDPOINTS
    if (path.includes("/api/auth/login")) {
      data = demoDb.login(body.email, body.password);
    } else if (path.includes("/api/auth/register")) {
      data = demoDb.register(body.name, body.email, body.password);
    } else if (path.includes("/api/auth/google")) {
      const users = demoDb.getUsers();
      data = { success: true, token: "mock_jwt_google_token", user: users[1] };
    } else if (path.includes("/api/auth/me") || path.endsWith("/api/auth")) {
      const token = config.headers?.Authorization?.replace("Bearer ", "") || "";
      const user = demoDb.getCurrentUserFromToken(token);
      if (user) {
        data = { success: true, user };
      } else {
        status = 401;
        data = { success: false, message: "Unauthorized session" };
      }
    }
    
    // 2. CATEGORY ENDPOINTS
    else if (path === "/api/categories" && method === "get") {
      data = { success: true, categories: demoDb.getCategories() };
    } else if (path === "/api/categories" && method === "post") {
      data = { success: true, category: demoDb.createCategory(body) };
    } else if (path.startsWith("/api/categories/") && method === "put") {
      const id = path.split("/").pop();
      data = { success: true, category: demoDb.updateCategory(id, body) };
    } else if (path.startsWith("/api/categories/") && method === "delete") {
      const id = path.split("/").pop();
      data = demoDb.deleteCategory(id);
    }
    
    // 3. PRODUCT ENDPOINTS
    else if (path === "/api/products" && method === "get") {
      const products = demoDb.getProducts();
      let filtered = [...products];
      
      const searchParam = config.params?.search;
      if (searchParam) {
        const q = String(searchParam).toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }

      const categoryParam = config.params?.category;
      if (categoryParam) {
        filtered = filtered.filter(p => p.categorySlug === categoryParam || p.category === categoryParam);
      }

      data = {
        success: true,
        products: filtered,
        pagination: { total: filtered.length, page: 1, pages: 1 }
      };
    } else if (path.startsWith("/api/products/stock/info") && method === "get") {
      const params = config.params || {};
      const productIds = (params.productIds || "").split(",").filter(Boolean);
      data = { success: true, stock: demoDb.getStockInfo(productIds) };
    } else if (path.startsWith("/api/products/") && method === "get") {
      const id = path.split("/").pop();
      const product = demoDb.getProductById(id);
      if (product) {
        data = { success: true, product };
      } else {
        status = 404;
        data = { success: false, message: "Product not found" };
      }
    } else if (path === "/api/products" && method === "post") {
      data = { success: true, product: demoDb.createProduct(body) };
    } else if (path.startsWith("/api/products/") && method === "put") {
      const id = path.split("/").pop();
      data = { success: true, product: demoDb.updateProduct(id, body) };
    } else if (path.startsWith("/api/products/") && method === "delete") {
      const id = path.split("/").pop();
      data = demoDb.deleteProduct(id);
    }
    
    // 4. HERO SLIDES ENDPOINTS
    else if (path === "/api/hero-slides" && method === "get") {
      data = { success: true, slides: demoDb.getHeroSlides() };
    } else if (path === "/api/hero-slides/admin" && method === "get") {
      data = { success: true, slides: demoDb.getHeroSlides() };
    } else if (path === "/api/hero-slides" && method === "post") {
      data = { success: true, slide: demoDb.createHeroSlide(body) };
    } else if (path.startsWith("/api/hero-slides/") && method === "patch") {
      const id = path.split("/").pop();
      data = { success: true, slide: demoDb.updateHeroSlide(id, body) };
    } else if (path.startsWith("/api/hero-slides/") && method === "delete") {
      const id = path.split("/").pop();
      data = demoDb.deleteHeroSlide(id);
    }
    
    // 5. COUPON ENDPOINTS
    else if (path === "/api/coupons" && method === "get") {
      data = { success: true, coupons: demoDb.getCoupons() };
    } else if (path === "/api/coupons" && method === "post") {
      const farFutureDate = new Date();
      farFutureDate.setFullYear(farFutureDate.getFullYear() + 10);
      data = { success: true, coupon: { _id: `cp_${Date.now()}`, ...body, expiresAt: farFutureDate } };
    }
    
    // 6. ORDER ENDPOINTS
    else if (path === "/api/orders" && method === "get") {
      data = { success: true, orders: demoDb.getOrders() };
    } else if (path === "/api/orders/my-orders" && method === "get") {
      const token = config.headers?.Authorization?.replace("Bearer ", "") || "";
      const user = demoDb.getCurrentUserFromToken(token);
      const orders = demoDb.getOrders();
      if (user) {
        data = { success: true, orders: orders.filter(o => o.customer?.email === user.email) };
      } else {
        data = { success: true, orders: [] };
      }
    } else if (path === "/api/orders" && method === "post") {
      data = { success: true, order: demoDb.createOrder(body) };
    } else if (path.startsWith("/api/orders/") && path.endsWith("/accept") && method === "patch") {
      const id = path.split("/")[3];
      data = { success: true, order: demoDb.acceptOrder(id, body.etaMinutes || 30) };
    } else if (path.startsWith("/api/orders/") && path.endsWith("/reject") && method === "patch") {
      const id = path.split("/")[3];
      data = { success: true, order: demoDb.rejectOrder(id, body.rejectionReason || "Rejection reason") };
    } else if (path.startsWith("/api/orders/") && path.endsWith("/preparing") && method === "patch") {
      const id = path.split("/")[3];
      data = { success: true, order: demoDb.markOrderPreparing(id) };
    } else if (path.startsWith("/api/orders/") && path.endsWith("/ready") && method === "patch") {
      const id = path.split("/")[3];
      data = { success: true, order: demoDb.markOrderReady(id) };
    } else if (path.startsWith("/api/orders/") && path.endsWith("/picked-up") && method === "patch") {
      const id = path.split("/")[3];
      data = { success: true, order: demoDb.markOrderPickedUp(id) };
    } else if (path.startsWith("/api/orders/") && path.endsWith("/delivered") && method === "patch") {
      const id = path.split("/")[3];
      data = { success: true, order: demoDb.markOrderDelivered(id) };
    } else if (path.startsWith("/api/orders/") && method === "get") {
      const id = path.split("/").pop();
      const order = demoDb.getOrders().find(o => o._id === id || o.orderNumber === id);
      data = { success: true, order };
    }
    
    // 7. DELIVERY CHECK
    else if (path.includes("/api/delivery/check-availability")) {
      data = { success: true, available: true, message: "Delivery is available to your location", estimatedDays: 2 };
    }
    
    // 8. REPORTING & DASHBOARD STATS
    else if (path.includes("/api/reports") || path.includes("/api/stats")) {
      const stats = demoDb.getStats();
      const orders = demoDb.getOrders();
      const totalRev = orders.reduce((sum, o) => o.status !== "REJECTED" ? sum + o.totals.grandTotal : sum, 0);
      data = {
        success: true,
        stats: {
          totalSales: totalRev || stats.totalSales,
          ordersCount: orders.length || stats.ordersCount,
          itemsSold: stats.itemsSold,
          conversionRate: stats.conversionRate
        }
      };
    }
    
    // 9. NEWSLETTER & CONTACT
    else if (path.includes("/api/newsletter") || path.includes("/api/contact")) {
      data = { success: true, message: "Submitted successfully" };
    }
    
    // FALLBACK
    else {
      console.warn(`[DEMO MOCK API] Unhandled route: ${method.toUpperCase()} ${path}`);
      data = { success: true, message: "Mocked route success" };
    }
  } catch (err) {
    console.error(`[DEMO MOCK API ERROR]`, err);
    status = 400;
    data = { success: false, message: err.message || "Something went wrong in mock DB" };
  }

  if (status >= 400) {
    return Promise.reject({
      response: {
        data,
        status,
        statusText: "Error"
      }
    });
  }

  return {
    data,
    status,
    statusText: "OK",
    headers: {},
    config
  };
};
