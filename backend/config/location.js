/**
 * Centralized location configuration for the store
 */
export const STORE_LOCATION = {
  address: "DemoMart, Demo City, Demo City, Demo State 000000",
  lat: 18.5679,
  lng: 73.9143,
  radiusLimitKm: 15,
  operationalLimitKm: 14.5, // Safety buffer to reduce GPS edge-case losses
  pincode: "000000"
};

/**
 * Internal delivery pricing (Simplified to flat rate for demo)
 */
export const DELIVERY_PRICING_CONFIG = [
  { maxKm: 999, fee: 60 }
];
