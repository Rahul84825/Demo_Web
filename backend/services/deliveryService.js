import { logger } from "../utils/logger.js";
import { getIo } from "../socket.js";
import Order from "../models/Order.js";

/**
 * ASSIGN DELIVERY PARTNER (Demo Delivery)
 * Replaced with a mock implementation that simply marks it as assigned.
 */
export const assignDeliveryPartner = async (orderId) => {
  logger.info(\`🚚 [MARK READY] STEP 4 - ASSIGN DELIVERY CALLED for Order: \${orderId} (Provider: Mock)\`);
  
  try {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.delivery = {
      ...(order.delivery || {}),
      provider: "mock",
      providerOrderId: \`MOCK-\${Date.now()}\`,
      trackingId: \`MOCK-\${Date.now()}\`,
      trackingUrl: "",
      status: "DELIVERY_ASSIGNED",
      assignedAt: new Date()
    };

    order.rider = {
      name: "Demo Rider",
      phone: "9999999999",
      vehicleNumber: "MH12 DE 1234"
    };

    await order.save();
    
    const io = getIo();
    if (io) {
      io.emit("order:updated", order.toObject());
    }

    return order;
  } catch (error) {
    logger.error(\`❌ [MARK READY] FAILED at assignDeliveryPartner:\`, error.message);
    throw error;
  }
};

/**
 * Automates transition to READY
 */
export const scheduleOrderReady = (orderId, etaMinutes) => {
  setTimeout(async () => {
    try {
      const order = await Order.findById(orderId);
      if (order && order.status === "PREPARING") {
        order.status = "READY";
        order.statusTimestamps.readyForPickupAt = new Date();
        order.preparation.readyBy = new Date();
        await order.save();
        const io = getIo();
        if (io) io.emit("order:updated", order.toObject());
      }
    } catch (err) {}
  }, etaMinutes * 60 * 1000);
};

export const syncActiveOrders = async () => {
  // No-op for demo
};