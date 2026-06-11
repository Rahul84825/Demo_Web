// DEMO MODE — replace with real database operations before production
import { SEED_DATA } from "./demo.config";

const DB_PREFIX = "demomart_db_";

const loadData = (key, defaultData) => {
  const data = localStorage.getItem(DB_PREFIX + key);
  if (data) return JSON.parse(data);
  localStorage.setItem(DB_PREFIX + key, JSON.stringify(defaultData));
  return defaultData;
};

const saveData = (key, data) => {
  localStorage.setItem(DB_PREFIX + key, JSON.stringify(data));
};

export const demoDb = {
  getUsers: () => loadData("users", SEED_DATA.users),
  getProducts: () => loadData("products", SEED_DATA.products),
  getCategories: () => loadData("categories", SEED_DATA.categories),
  getOrders: () => loadData("orders", SEED_DATA.orders),
  getCoupons: () => loadData("coupons", SEED_DATA.coupons),
  getHeroSlides: () => loadData("heroSlides", SEED_DATA.heroSlides),
  getNotifications: () => loadData("notifications", SEED_DATA.notifications),
  getStats: () => loadData("stats", SEED_DATA.stats),

  // Auth Operations
  login: (email, password) => {
    const users = demoDb.getUsers();
    // Admin login shortcut
    if (email === "admin@demo.com" && password === "demo1234") {
      const adminUser = users.find(u => u.role === "admin") || SEED_DATA.users[0];
      return { success: true, token: "mock_jwt_admin_token", user: adminUser };
    }
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error("Invalid credentials");
    }
    return { success: true, token: `mock_jwt_user_token_${user._id}`, user };
  },

  register: (name, email, password) => {
    const users = demoDb.getUsers();
    if (users.find(u => u.email === email)) {
      throw new Error("Email already registered");
    }
    const newUser = {
      _id: `u_${Date.now()}`,
      name,
      email,
      role: "user",
      isAdmin: false,
      avatar: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      phone: "+91 99999 99999",
      shippingAddress: { line1: "Demo Address 123", city: "Demo City", postalCode: "110001", state: "Demo State" }
    };
    users.push(newUser);
    saveData("users", users);
    return { success: true, token: `mock_jwt_user_token_${newUser._id}`, user: newUser };
  },

  getCurrentUserFromToken: (token) => {
    const users = demoDb.getUsers();
    if (token === "mock_jwt_admin_token") {
      return users.find(u => u.role === "admin");
    }
    if (token && token.startsWith("mock_jwt_user_token_")) {
      const userId = token.replace("mock_jwt_user_token_", "");
      return users.find(u => u._id === userId);
    }
    return null;
  },

  // Product CRUD
  getProductById: (id) => {
    const products = demoDb.getProducts();
    return products.find(p => p._id === id || p.slug === id);
  },

  createProduct: (productData) => {
    const products = demoDb.getProducts();
    const newProduct = {
      _id: `p_${Date.now()}`,
      slug: (productData.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      gstPercent: 18,
      packingCharges: 40,
      isAvailable: true,
      variants: [{ label: "Standard", mrp: Number(productData.price) + 200, sellingPrice: Number(productData.price), finalPrice: Number(productData.price), stock: 100, isAvailable: true }],
      ...productData
    };
    products.unshift(newProduct);
    saveData("products", products);
    return newProduct;
  },

  updateProduct: (id, productData) => {
    const products = demoDb.getProducts();
    const idx = products.findIndex(p => p._id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...productData };
      saveData("products", products);
      return products[idx];
    }
    throw new Error("Product not found");
  },

  deleteProduct: (id) => {
    let products = demoDb.getProducts();
    products = products.filter(p => p._id !== id);
    saveData("products", products);
    return { success: true };
  },

  // Category CRUD
  createCategory: (categoryData) => {
    const categories = demoDb.getCategories();
    const newCategory = {
      _id: `c_${Date.now()}`,
      slug: (categoryData.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      is_active: true,
      showInNavbar: true,
      showInHomepage: true,
      ...categoryData
    };
    categories.push(newCategory);
    saveData("categories", categories);
    return newCategory;
  },

  updateCategory: (id, categoryData) => {
    const categories = demoDb.getCategories();
    const idx = categories.findIndex(c => c._id === id || c.slug === id);
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...categoryData };
      saveData("categories", categories);
      return categories[idx];
    }
    throw new Error("Category not found");
  },

  deleteCategory: (id) => {
    let categories = demoDb.getCategories();
    categories = categories.filter(c => c._id !== id && c.slug !== id);
    saveData("categories", categories);
    return { success: true };
  },

  // Orders Operations
  createOrder: (orderData) => {
    const orders = demoDb.getOrders();
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Process items and check/reduce stock
    const products = demoDb.getProducts();
    const items = (orderData.items || []).map(item => {
      const p = products.find(prod => prod._id === item.productId);
      if (p) {
        // Decrease stock in mockDB
        p.variants.forEach(v => {
          if (v.stock > 0) {
            v.stock = Math.max(0, v.stock - (item.quantity || 1));
          }
        });
      }
      return {
        ...item,
        titleSnapshot: item.name || item.titleSnapshot,
        imageSnapshot: item.image || item.imageSnapshot
      };
    });
    saveData("products", products);

    const newOrder = {
      _id: `o_${Date.now()}`,
      orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}-${suffix}`,
      createdAt: new Date().toISOString(),
      status: "PLACED",
      customer: orderData.customer || { name: "Guest User", email: "guest@demo.com", phone: "+91 99999 99999" },
      shippingAddress: orderData.shippingAddress || { line1: "Demo Address 123", city: "Demo City", postalCode: "110001" },
      payment: {
        method: orderData.paymentMethod || "ONLINE",
        status: "PAID",
        demopaymentOrderId: "demo_order_" + Date.now(),
        demopaymentPaymentId: "pay_mock_" + Date.now(),
        demopaymentSignature: "sig_mock_" + Date.now()
      },
      items,
      totals: orderData.totals || {
        itemsSubtotal: orderData.amount,
        gstTotal: Math.round(orderData.amount * 0.18),
        packingTotal: 40,
        shippingFee: 0,
        discountTotal: 0,
        grandTotal: orderData.amount
      }
    };

    orders.unshift(newOrder);
    saveData("orders", orders);
    return newOrder;
  },

  updateOrderStatus: (id, status, extraFields = {}) => {
    const orders = demoDb.getOrders();
    const idx = orders.findIndex(o => o._id === id);
    if (idx !== -1) {
      orders[idx] = {
        ...orders[idx],
        status,
        ...extraFields,
        statusTimestamps: {
          ...(orders[idx].statusTimestamps || {}),
          [status.toLowerCase() + "At"]: new Date()
        }
      };
      saveData("orders", orders);
      return orders[idx];
    }
    throw new Error("Order not found");
  },

  acceptOrder: (orderId, etaMinutes) => {
    return demoDb.updateOrderStatus(orderId, "ACCEPTED", {
      preparation: {
        etaMinutes,
        acceptedAt: new Date(),
        readyBy: new Date(Date.now() + etaMinutes * 60000)
      }
    });
  },

  rejectOrder: (orderId, reason) => {
    const order = demoDb.updateOrderStatus(orderId, "REJECTED", { rejectionReason: reason });
    // Restore stock in mockDB
    const products = demoDb.getProducts();
    (order.items || []).forEach(item => {
      const p = products.find(prod => prod._id === item.productId);
      if (p) {
        p.variants.forEach(v => {
          v.stock += (item.quantity || 1);
        });
      }
    });
    saveData("products", products);
    return order;
  },

  markOrderPreparing: (orderId) => {
    return demoDb.updateOrderStatus(orderId, "PREPARING");
  },

  markOrderReady: (orderId) => {
    return demoDb.updateOrderStatus(orderId, "READY");
  },

  markOrderPickedUp: (orderId) => {
    return demoDb.updateOrderStatus(orderId, "PICKED_UP", {
      delivery: {
        provider: "mock",
        providerOrderId: `MOCK-${Date.now()}`,
        trackingId: `MOCK-${Date.now()}`,
        trackingUrl: "",
        status: "DELIVERY_ASSIGNED",
        assignedAt: new Date()
      },
      rider: {
        name: "Demo Rider",
        phone: "+91 98765 43210",
        vehicleNumber: "MH-12-DE-1234"
      }
    });
  },

  markOrderDelivered: (orderId) => {
    return demoDb.updateOrderStatus(orderId, "DELIVERED", {
      "payment.status": "PAID"
    });
  },

  // Stock operations
  getStockInfo: (productIds) => {
    const products = demoDb.getProducts();
    return products
      .filter(p => productIds.includes(p._id))
      .map(p => ({
        productId: p._id,
        stock: p.variants?.[0]?.stock || 0,
        isAvailable: p.isAvailable
      }));
  },

  // Reset Operation
  resetDemoData: () => {
    Object.keys(SEED_DATA).forEach(key => {
      localStorage.removeItem(DB_PREFIX + key);
    });
    // Restore default session token if any
    localStorage.removeItem(DB_PREFIX + "token");
    console.log("🔄 DEMO MODE: Database state reset to default seeds.");
    return { success: true };
  }
};
