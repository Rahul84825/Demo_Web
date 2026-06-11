import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import { getIo } from "../socket.js";
import { logger } from "../utils/logger.js";
import generateOrderId from "../utils/orderIdGenerator.js";
import { InventoryError, reserveStock } from "../services/inventoryService.js";

import {
  sendPaymentSuccessEmail,
  sendOrderPlacedEmail,
  sendAdminNewOrderAlert
} from "../services/emailService.js";

const isPlainObject = (value) => Boolean(value && typeof value === "object" && !Array.isArray(value));

const extractOrderData = (body) => {
  if (isPlainObject(body?.orderData)) return body.orderData;
  if (isPlainObject(body?.order)) return body.order;
  if (isPlainObject(body)) {
    const { amount, currency, receipt, demopayment_order_id, demopayment_payment_id, demopayment_signature, ...orderData } = body;
    return orderData;
  }
  return {};
};

export const createPaymentOrder = async (req, res) => {
  return res.status(201).json({
    success: true,
    message: "Demo order created",
    orderId: "demo_order_" + Date.now(),
    amount: req.body.amount,
    currency: req.body.currency || "INR"
  });
};

export const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const { demopayment_order_id, demopayment_payment_id, demopayment_signature } = req.body;
    const orderData = extractOrderData(req.body);

    let createdOrder;
    await session.withTransaction(async () => {
      let coupon = null;
      const couponCode = orderData?.couponCode || orderData?.totals?.couponCode;
      if (couponCode) {
        const foundCoupon = await Coupon.findOne({ code: String(couponCode).toUpperCase().trim() });
        if (foundCoupon && foundCoupon.isValid(orderData?.totals?.itemsSubtotal || 0).valid) {
          coupon = foundCoupon;
        }
      }

      const { itemSnapshots, totals } = await reserveStock({
        items: orderData?.items || [],
        session,
        orderNumber: `DEMO-${Date.now()}`,
        reason: "Demo order placed",
        coupon,
        discountTotal: orderData?.totals?.discountTotal || 0,
        shippingFee: orderData?.totals?.shippingFee || 0,
        pincode: orderData?.shippingAddress?.postalCode || orderData?.customer?.pincode || "",
        roundingAdjustment: orderData?.totals?.roundingAdjustment || 0
      });

      if (coupon) {
        await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } }, { session });
      }

      const [orderDoc] = await Order.create([{
        orderId: generateOrderId(),
        orderNumber: `ORD-DEMO-${Date.now().toString(36).toUpperCase()}`,
        customer: {
          userId: orderData?.customer?.userId || req.user?.userId || null,
          name: orderData?.customer?.name || "Guest",
          email: orderData?.customer?.email || "",
          phone: orderData?.customer?.phone || ""
        },
        shippingAddress: {
          line1: orderData?.shippingAddress?.line1 || orderData?.customer?.address || "",
          city: orderData?.shippingAddress?.city || orderData?.customer?.city || "",
          state: orderData?.shippingAddress?.state || orderData?.customer?.state || "Maharashtra",
          postalCode: orderData?.shippingAddress?.postalCode || orderData?.shippingAddress?.pincode || orderData?.customer?.pincode || orderData?.customer?.postalCode || "",
          country: "IN"
        },
        items: itemSnapshots,
        payment: {
          method: "demopayment",
          status: "PAID",
          gateway: "demo",
          demopaymentOrderId: demopayment_order_id,
          demopaymentPaymentId: demopayment_payment_id,
          demopaymentSignature: demopayment_signature,
          paidAt: new Date()
        },
        status: "PLACED",
        statusTimestamps: { placedAt: new Date() },
        totals: {
          ...totals,
          gstTotal: totals.gstTotal || 0,
          currency: "INR"
        },
        coupon: coupon ? {
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue
        } : undefined,
        metadata: { razorpayOrderStatus: "PAID" }
      }], { session });

      createdOrder = orderDoc;
    });

    if (!createdOrder) throw new Error("Order creation failed");

    const io = getIo();
    if (io) {
      io.emit("order:new", createdOrder.toObject());
    }

    sendPaymentSuccessEmail(createdOrder).catch(() => {});
    sendOrderPlacedEmail(createdOrder).catch(() => {});
    sendAdminNewOrderAlert(createdOrder).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Payment verified and order created successfully",
      order: createdOrder
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    if (session) await session.endSession();
  }
};
