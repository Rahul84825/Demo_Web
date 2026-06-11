/**
 * Single Source of Truth for Demo City Pincode Delivery Zones.
 */
/**
 * Helper to get delivery zone by pincode
 * Simplified for demo template to accept any 6-digit pincode.
 * @param {string} pincode 
 * @returns {Object|null} Zone info if found, else null
 */
export const getZoneByPincode = (pincode) => {
  if (!pincode || String(pincode).length !== 6) return null;
  return {
    area: "Demo Service Area",
    city: "Demo City",
    fee: 60,
    eta: "30-60 mins",
    available: true
  };
};
