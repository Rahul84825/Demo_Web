import { Router } from "express";

const router = Router();

// Mock delivery availability check
router.post("/check-availability", (req, res) => {
  const { pincode } = req.body;
  
  console.log(`📡 [MOCK DELIVERY] Checking availability for pincode: ${pincode}`);
  
  return res.status(200).json({
    success: true,
    available: true,
    message: "Delivery is available to your location",
    estimatedDays: 2,
    provider: "mock"
  });
});

export default router;
