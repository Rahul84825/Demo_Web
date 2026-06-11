// DEMO MODE — replace with real configuration before production
export const DEMO_MODE = true;

const farFutureDate = new Date();
farFutureDate.setFullYear(farFutureDate.getFullYear() + 10);

export const SEED_DATA = {
  users: [
    {
      _id: "u_admin",
      name: "Demo Admin",
      email: "admin@demo.com",
      role: "admin",
      isAdmin: true,
      avatar: "DA"
    },
    {
      _id: "u_john",
      name: "John Doe",
      email: "john@demo.com",
      role: "user",
      isAdmin: false,
      avatar: "JD",
      phone: "+91 98765 43210",
      shippingAddress: {
        line1: "102 Blue Terrace Apartments, Sector 45",
        city: "Demo City",
        postalCode: "110001",
        state: "Demo State"
      }
    },
    {
      _id: "u_jane",
      name: "Jane Smith",
      email: "jane@demo.com",
      role: "user",
      isAdmin: false,
      avatar: "JS",
      phone: "+91 91234 56789",
      shippingAddress: {
        line1: "456 Greenwood Drive, Park View Area",
        city: "Demo City",
        postalCode: "110001",
        state: "Demo State"
      }
    },
    {
      _id: "u_alice",
      name: "Alice Johnson",
      email: "alice@demo.com",
      role: "user",
      isAdmin: false,
      avatar: "AJ",
      phone: "+91 99999 88888",
      shippingAddress: {
        line1: "789 Skyline Heights, 12th Floor",
        city: "Demo City",
        postalCode: "110001",
        state: "Demo State"
      }
    }
  ],
  categories: [
    { _id: "c_elec", name: "Electronics", slug: "electronics", order: 1, showInNavbar: true, showInHomepage: true, is_active: true },
    { _id: "c_fash", name: "Fashion", slug: "fashion", order: 2, showInNavbar: true, showInHomepage: true, is_active: true },
    { _id: "c_home", name: "Home", slug: "home", order: 3, showInNavbar: true, showInHomepage: true, is_active: true },
    { _id: "c_sport", name: "Sports", slug: "sports", order: 4, showInNavbar: true, showInHomepage: true, is_active: true },
    { _id: "c_access", name: "Accessories", slug: "accessories", order: 5, showInNavbar: true, showInHomepage: true, is_active: true }
  ],
  products: [
    // Electronics
    {
      _id: "p_headphone",
      name: "Wireless Noise-Cancelling Headphones",
      slug: "wireless-headphones",
      category: "Electronics",
      categorySlug: "electronics",
      description: "Experience premium sound with industry-leading noise cancelling, 30-hour battery life, and voice assistant integration.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
      gstPercent: 18,
      packingCharges: 50,
      isAvailable: true,
      variants: [{ label: "Standard", mrp: 4999, sellingPrice: 3499, finalPrice: 3499, stock: 124, isAvailable: true }]
    },
    {
      _id: "p_watch",
      name: "Smart Health & Fitness Tracker",
      slug: "smart-health-tracker",
      category: "Electronics",
      categorySlug: "electronics",
      description: "Track your active lifestyle with built-in heart rate monitor, sleep tracking, GPS, and up to 7 days of standby charge.",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
      gstPercent: 18,
      packingCharges: 30,
      isAvailable: true,
      variants: [{ label: "Sport", mrp: 2999, sellingPrice: 2199, finalPrice: 2199, stock: 86, isAvailable: true }]
    },
    {
      _id: "p_keyboard",
      name: "Ultra Slim Bluetooth Keyboard",
      slug: "bluetooth-keyboard",
      category: "Electronics",
      categorySlug: "electronics",
      description: "Elegant layout, quiet keys, and multi-device connection. Perfect for working seamlessly across laptops and tablets.",
      image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
      gstPercent: 18,
      packingCharges: 20,
      isAvailable: true,
      variants: [{ label: "Standard", mrp: 1999, sellingPrice: 1299, finalPrice: 1299, stock: 15, isAvailable: true }]
    },
    {
      _id: "p_speaker",
      name: "Waterproof Portable Speaker",
      slug: "portable-speaker",
      category: "Electronics",
      categorySlug: "electronics",
      description: "Powerful 360-degree sound, compact lightweight design, and IPX7 waterproofing. Bring your tunes anywhere.",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
      gstPercent: 18,
      packingCharges: 40,
      isAvailable: true,
      variants: [{ label: "Aqua", mrp: 2499, sellingPrice: 1599, finalPrice: 1599, stock: 48, isAvailable: true }]
    },
    // Fashion
    {
      _id: "p_jacket",
      name: "Classic Denim Button Jacket",
      slug: "classic-denim-jacket",
      category: "Fashion",
      categorySlug: "fashion",
      description: "Premium washed cotton denim, durable buttons, and a timeless silhouette designed to layer perfectly with any outfit.",
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80",
      gstPercent: 12,
      packingCharges: 30,
      isAvailable: true,
      variants: [{ label: "Regular Fit", mrp: 2999, sellingPrice: 1899, finalPrice: 1899, stock: 54, isAvailable: true }]
    },
    {
      _id: "p_shoes",
      name: "Lightweight Running Sneakers",
      slug: "running-sneakers",
      category: "Fashion",
      categorySlug: "fashion",
      description: "Flexible breathable mesh upper and advanced cloud cushioning structure to provide maximum comfort on every stride.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
      gstPercent: 12,
      packingCharges: 50,
      isAvailable: true,
      variants: [{ label: "Sport 10", mrp: 3999, sellingPrice: 2499, finalPrice: 2499, stock: 32, isAvailable: true }]
    },
    {
      _id: "p_shirt",
      name: "Casual Button-Down Cotton Shirt",
      slug: "casual-cotton-shirt",
      category: "Fashion",
      categorySlug: "fashion",
      description: "Soft breathable linen-cotton blend with chest pocket, curved hem, and a structured collar for a relaxed smart look.",
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
      gstPercent: 12,
      packingCharges: 15,
      isAvailable: true,
      variants: [{ label: "Medium", mrp: 1499, sellingPrice: 899, finalPrice: 899, stock: 78, isAvailable: true }]
    },
    {
      _id: "p_backpack",
      name: "Minimalist Daily Leather Backpack",
      slug: "leather-backpack",
      category: "Fashion",
      categorySlug: "fashion",
      description: "Water-resistant vegan leather, dedicated padded laptop sleeve, secret travel pockets, and minimal modern hardware.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
      gstPercent: 18,
      packingCharges: 40,
      isAvailable: true,
      variants: [{ label: "Matte Black", mrp: 4500, sellingPrice: 2999, finalPrice: 2999, stock: 22, isAvailable: true }]
    },
    // Home
    {
      _id: "p_vase",
      name: "Ceramic Table Vase Set",
      slug: "ceramic-table-vase",
      category: "Home",
      categorySlug: "home",
      description: "Set of three minimal white textured clay vases in varied heights, bringing a modern organic finish to your room.",
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80",
      gstPercent: 12,
      packingCharges: 60,
      isAvailable: true,
      variants: [{ label: "Trio Set", mrp: 1299, sellingPrice: 799, finalPrice: 799, stock: 18, isAvailable: true }]
    },
    {
      _id: "p_clock",
      name: "Modern Silent Wall Clock",
      slug: "silent-wall-clock",
      category: "Home",
      categorySlug: "home",
      description: "Silent sweep clock mechanism, lightweight oak wood frame, and clean minimalist numbers. Elegance at a glance.",
      image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80",
      gstPercent: 12,
      packingCharges: 30,
      isAvailable: true,
      variants: [{ label: "Standard", mrp: 999, sellingPrice: 650, finalPrice: 650, stock: 3, isAvailable: true }]
    },
    {
      _id: "p_sheet",
      name: "Organic Combed Cotton Bed Sheets",
      slug: "cotton-bedsheets",
      category: "Home",
      categorySlug: "home",
      description: "400 thread count sateen weave, GOTS certified organic cotton, double stitched borders, including 2 pillowcases.",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
      gstPercent: 12,
      packingCharges: 35,
      isAvailable: true,
      variants: [{ label: "Queen Size", mrp: 2499, sellingPrice: 1499, finalPrice: 1499, stock: 92, isAvailable: true }]
    },
    {
      _id: "p_lamp",
      name: "Dimmable LED Desk & Table Lamp",
      slug: "dimmable-table-lamp",
      category: "Home",
      categorySlug: "home",
      description: "Three color temperature modes, touch sensor controls, flicker-free light filter, and flexible gooseneck layout.",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
      gstPercent: 18,
      packingCharges: 40,
      isAvailable: true,
      variants: [{ label: "Warm White", mrp: 1799, sellingPrice: 1190, finalPrice: 1190, stock: 1, isAvailable: true }]
    },
    // Sports
    {
      _id: "p_yogamat",
      name: "Premium Non-Slip Yoga Mat",
      slug: "non-slip-yoga-mat",
      category: "Sports",
      categorySlug: "sports",
      description: "6mm dense eco-friendly TPE cushioning, dual-sided non-slip traction grid, body alignment guidance lines, and carrying strap.",
      image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80",
      gstPercent: 12,
      packingCharges: 25,
      isAvailable: true,
      variants: [{ label: "Indigo Blue", mrp: 1499, sellingPrice: 950, finalPrice: 950, stock: 45, isAvailable: true }]
    },
    {
      _id: "p_dumbbell",
      name: "Adjustable Dial Dumbbell Set",
      slug: "adjustable-dumbbell",
      category: "Sports",
      categorySlug: "sports",
      description: "Adjustable weights with a selector dial system. Replace up to 10 separate dumbbells for home workouts.",
      image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&q=80",
      gstPercent: 18,
      packingCharges: 150,
      isAvailable: true,
      variants: [{ label: "Single 20kg", mrp: 4999, sellingPrice: 3299, finalPrice: 3299, stock: 14, isAvailable: true }]
    },
    {
      _id: "p_ball",
      name: "Anti-Burst Heavy Gym Ball",
      slug: "gym-workout-ball",
      category: "Sports",
      categorySlug: "sports",
      description: "Extra thick professional PVC shell, rated up to 500kg, non-slip matte texture, and quick foot pump included.",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
      gstPercent: 12,
      packingCharges: 30,
      isAvailable: true,
      variants: [{ label: "65cm", mrp: 799, sellingPrice: 499, finalPrice: 499, stock: 65, isAvailable: true }]
    },
    {
      _id: "p_racket",
      name: "Carbon Fiber Tennis Racket",
      slug: "carbon-tennis-racket",
      category: "Sports",
      categorySlug: "sports",
      description: "Aerodynamic frame design, head-heavy balance point, pre-strung with high-tension nylon strings, and synthetic grip.",
      image: "https://images.unsplash.com/photo-1617083934386-57094a93d9e4?w=400&q=80",
      gstPercent: 18,
      packingCharges: 45,
      isAvailable: true,
      variants: [{ label: "Standard 27\"", mrp: 3299, sellingPrice: 2199, finalPrice: 2199, stock: 0, isAvailable: true }]
    }
  ],
  coupons: [
    { _id: "cp_welcome", code: "WELCOME50", discountType: "FLAT", discountValue: 50, minOrderAmount: 500, expiresAt: farFutureDate, isActive: true, description: "Flat ₹50 off on orders above ₹500" },
    { _id: "cp_save", code: "SAVE10", discountType: "PERCENTAGE", discountValue: 10, minOrderAmount: 1000, expiresAt: farFutureDate, isActive: true, description: "10% off on orders above ₹1000" }
  ],
  heroSlides: [
    { _id: "hs_1", title: "Next-Gen Retail Showcase", subtitle: "SaaS-Grade Demo Platform", description: "Discover curated electronics, apparel, and active sports gear.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200x400&q=80", isActive: true },
    { _id: "hs_2", title: "Smart Daily Essentials", subtitle: "Sleek Modern Aesthetics", description: "Minimalist designs built to match your modern working environment.", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200x400&q=80", isActive: true }
  ],
  notifications: [
    { id: "nt_1", message: "Welcome to DemoMart! Try placing a test checkout order.", type: "info", date: "Just now" },
    { id: "nt_2", message: "Admin credentials: admin@demo.com / demo1234", type: "warning", date: "5m ago" },
    { id: "nt_3", message: "Your mock payment checkouts are fully active.", type: "success", date: "1h ago" }
  ],
  orders: [
    {
      _id: "o_1",
      orderNumber: "ORD-K9A4B8-9F",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4h ago
      status: "PLACED",
      customer: {
        name: "John Doe",
        email: "john@demo.com",
        phone: "+91 98765 43210"
      },
      shippingAddress: {
        line1: "102 Blue Terrace Apartments, Sector 45",
        city: "Demo City",
        postalCode: "110001",
        state: "Demo State"
      },
      payment: {
        method: "ONLINE",
        status: "PAID",
        demopaymentOrderId: "demo_order_1001",
        demopaymentPaymentId: "pay_1001",
        demopaymentSignature: "sig_1001"
      },
      items: [
        {
          productId: "p_headphone",
          name: "Wireless Noise-Cancelling Headphones",
          titleSnapshot: "Wireless Noise-Cancelling Headphones",
          quantity: 1,
          price: 3499,
          finalAmount: 3499,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
          imageSnapshot: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
          selectedVariant: { label: "Standard", mrp: 4999, sellingPrice: 3499, finalPrice: 3499 }
        }
      ],
      totals: {
        itemsSubtotal: 3499,
        gstTotal: 630,
        packingTotal: 50,
        shippingFee: 0,
        discountTotal: 0,
        grandTotal: 4179
      }
    },
    {
      _id: "o_2",
      orderNumber: "ORD-M3L8K9-1Z",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1d ago
      status: "ACCEPTED",
      customer: {
        name: "Jane Smith",
        email: "jane@demo.com",
        phone: "+91 91234 56789"
      },
      shippingAddress: {
        line1: "456 Greenwood Drive, Park View Area",
        city: "Demo City",
        postalCode: "110001",
        state: "Demo State"
      },
      payment: {
        method: "ONLINE",
        status: "PAID",
        demopaymentOrderId: "demo_order_1002",
        demopaymentPaymentId: "pay_1002",
        demopaymentSignature: "sig_1002"
      },
      items: [
        {
          productId: "p_watch",
          name: "Smart Health & Fitness Tracker",
          titleSnapshot: "Smart Health & Fitness Tracker",
          quantity: 1,
          price: 2199,
          finalAmount: 2199,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
          imageSnapshot: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
          selectedVariant: { label: "Sport", mrp: 2999, sellingPrice: 2199, finalPrice: 2199 }
        }
      ],
      totals: {
        itemsSubtotal: 2199,
        gstTotal: 396,
        packingTotal: 30,
        shippingFee: 0,
        discountTotal: 0,
        grandTotal: 2625
      }
    },
    {
      _id: "o_3",
      orderNumber: "ORD-Z8K2P5-4X",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3d ago
      status: "DELIVERED",
      customer: {
        name: "Alice Johnson",
        email: "alice@demo.com",
        phone: "+91 99999 88888"
      },
      shippingAddress: {
        line1: "789 Skyline Heights, 12th Floor",
        city: "Demo City",
        postalCode: "110001",
        state: "Demo State"
      },
      payment: {
        method: "ONLINE",
        status: "PAID",
        demopaymentOrderId: "demo_order_1003",
        demopaymentPaymentId: "pay_1003",
        demopaymentSignature: "sig_1003"
      },
      items: [
        {
          productId: "p_yogamat",
          name: "Premium Non-Slip Yoga Mat",
          titleSnapshot: "Premium Non-Slip Yoga Mat",
          quantity: 1,
          price: 950,
          finalAmount: 950,
          image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80",
          imageSnapshot: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80",
          selectedVariant: { label: "Indigo Blue", mrp: 1499, sellingPrice: 950, finalPrice: 950 }
        }
      ],
      totals: {
        itemsSubtotal: 950,
        gstTotal: 114,
        packingTotal: 25,
        shippingFee: 50,
        discountTotal: 0,
        grandTotal: 1139
      }
    }
  ],
  stats: {
    totalSales: 48320,
    ordersCount: 1284,
    itemsSold: 2451,
    conversionRate: 3.84
  }
};
