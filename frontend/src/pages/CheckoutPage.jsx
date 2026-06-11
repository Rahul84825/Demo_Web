import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { useDebounce } from "../hooks/useDebounce";
import { calculateTotals, formatCurrency, TAX_MESSAGE } from "shared/utils/pricing";
import api, { getApiErrorMessage, checkDeliveryAvailability } from "../services/api";
import StoreMap from "../components/common/StoreMap";
import LocationCard from "../components/common/LocationCard";
import AvailableCoupons from "../components/checkout/AvailableCoupons";
import { Phone, MessageSquare, MapPin, Truck, MapPinOff, Loader2, Tag } from "lucide-react";

let demopaymentScriptPromise;

const loadDemoPaymentScript = () => {
  if (demopaymentScriptPromise) return demopaymentScriptPromise;

  demopaymentScriptPromise = new Promise((resolve) => {
    if (window.DemoPayment) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.demopayment.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      demopaymentScriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return demopaymentScriptPromise;
};

const CHECKOUT_STORAGE_KEY = "demo-mart-checkout-state";

function CheckoutPage() {
  const { cart, dispatch } = useCart();
  const { fetchProducts } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      const lastPincode = localStorage.getItem("demo-mart-last-pincode") || "";
      
      const baseForm = parsed?.form || { name: "", phone: "", email: "", address: "", city: "", pincode: "", state: "Maharashtra" };
      
      if (lastPincode && !baseForm.pincode) {
        baseForm.pincode = lastPincode;
      }
      
      return baseForm;
    } catch {
      return { name: "", phone: "", email: "", address: "", city: "", pincode: localStorage.getItem("demo-mart-last-pincode") || "", state: "Maharashtra" };
    }
  });

  const [step, setStep] = useState(() => {
    try {
      const saved = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed?.step || 1;
    } catch {
      return 1;
    }
  });

  const [processing, setProcessing] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [isOrderSuccessful, setIsOrderSuccessful] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isValidatingPincode, setIsValidatingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");
  const [showOffers, setShowOffers] = useState(false);

  const isMountedRef = useRef(true);

  const { 
    subtotal, 
    total, 
    deliveryFee, 
    gstTotal, 
    packingTotal,
    couponDiscount, 
    isFreeDelivery, 
    deliveryThreshold, 
    deliveryLabel, 
    outOfReach: localOutOfReach 
  } = calculateTotals(cart, { 
    coupon: appliedCoupon, 
    pincode: form.pincode,
    manualShipping: deliveryInfo?.deliveryAvailable ? deliveryInfo.deliveryFee : null
  });

  const isAvailable = useMemo(() => {
    if (form.pincode.length < 6) return true;
    if (pincodeError) return false;
    if (deliveryInfo) return deliveryInfo.deliveryAvailable;
    return true;
  }, [pincodeError, deliveryInfo, form.pincode]);

  const isAddressValid = form.name && form.phone && form.address && form.city && form.pincode.length === 6 && isAvailable;

  useEffect(() => {
    loadDemoPaymentScript().then(setScriptReady);
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify({ form, step }));
  }, [form, step]);

  useEffect(() => {
    async function validatePincode() {
      const pc = String(form.pincode).trim();
      
      if (pc.length !== 6) {
        setDeliveryInfo(null);
        setPincodeError("");
        return;
      }

      setIsValidatingPincode(true);
      setPincodeError("");
      
      try {
        const data = await checkDeliveryAvailability(pc);
        if (data.success) {
          setDeliveryInfo(data);
          if (data.deliveryAvailable) {
            setForm(prev => ({ ...prev, city: data.city || "Demo City" }));
          } else {
            setPincodeError(data.message || "Delivery unavailable for this pincode.");
          }
        }
      } catch (err) {
        setPincodeError(getApiErrorMessage(err, "Could not validate pincode."));
        setDeliveryInfo(null);
      } finally {
        setIsValidatingPincode(false);
      }
    }

    validatePincode();
  }, [form.pincode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pincode") {
      const val = value.replace(/\D/g, "").slice(0, 6);
      setForm(prev => ({ ...prev, [name]: val }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError("");
    try {
      const { data } = await api.post("/api/coupons/validate", { 
        code: couponCode, 
        orderAmount: subtotal,
        userId: user?.userId || user?._id
      });
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponCode("");
      } else {
        setCouponError(data.message || "Invalid coupon");
      }
    } catch (err) {
      setCouponError(getApiErrorMessage(err));
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const handleApplyAvailableCoupon = (code) => {
    setCouponCode(code);
    setShowOffers(false);
    setTimeout(() => {
      handleApplyCoupon();
    }, 100);
  };

  const handleOrderSuccess = async (order) => {
    setIsOrderSuccessful(true);
    dispatch({ type: "CLEAR" });
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
    if (order?._id) sessionStorage.setItem("last_order_id", order._id);
    
    fetchProducts().catch(console.error);
    
    navigate("/payment-success", { state: { order }, replace: true });
  };

  const handleOnlinePayment = async () => {
    if (!isAvailable) return setErrorMessage("Delivery not available for this location");
    
    setProcessing(true);
    try {
      const verifyPayload = {
        demopayment_order_id: `demo_order_${Date.now()}`,
        demopayment_payment_id: `demo_payment_${Date.now()}`,
        demopayment_signature: "mock_signature",
        orderData: {
          customer: { ...form, userId: user?.userId || user?._id },
          shippingAddress: { 
            line1: form.address, 
            city: form.city, 
            state: form.state, 
            postalCode: form.pincode, 
            country: "IN",
            geo: deliveryInfo?.geo || null
          },
          items: cart.map(i => ({ ...i, productId: i.productId })),
          amount: total,
          totals: { 
            itemsSubtotal: subtotal, 
            shippingFee: deliveryFee, 
            gstTotal, 
            packingTotal,
            grandTotal: total, 
            currency: "INR",
            couponCode: appliedCoupon?.code
          },
          metadata: {
            distanceKm: deliveryInfo?.distanceKm || 0,
            geocodedAddress: deliveryInfo?.formattedAddress || ""
          }
        }
      };

      const { data: verifyData } = await api.post("/api/payment/verify", verifyPayload);
      if (verifyData.success) {
        handleOrderSuccess(verifyData.order);
      } else {
        throw new Error(verifyData.message || "Verification failed");
      }
    } catch (err) {
      console.error("❌ PAYMENT_VERIFICATION_ERROR", err);
      const msg = getApiErrorMessage(err, "Payment verification failed");
      setErrorMessage(msg);
      setProcessing(false);
    }
  };

  if (cart.length === 0 && !isOrderSuccessful) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 text-center">
        <h2 className="text-3xl font-extrabold mb-4 text-slate-900">Your cart is empty</h2>
        <button onClick={() => navigate("/")} className="btn-primary">Go Shopping</button>
      </div>
    );
  }

  return (
    <div className="page-enter min-h-[60vh] bg-slate-50 px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="section-title mb-8 lg:mb-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900">Checkout</h2>
          <p className="text-sm lg:text-base text-slate-500 mt-2">Complete your order securely.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-10">
          <div className="space-y-6 lg:space-y-8">
            {/* ── STEP 1: ADDRESS ── */}
            <div className={`bg-white rounded-3xl border border-slate-200 p-6 md:p-8 transition-opacity ${step === 2 ? 'opacity-60 grayscale' : 'shadow-xl shadow-slate-200/40'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">1</div>
                <h3 className="text-xl font-bold text-slate-900">Delivery Details</h3>
              </div>
              
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Full Name</label>
                    <input name="name" value={form.name} onChange={handleChange} className="input-field bg-slate-50" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="input-field bg-slate-50" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Email</label>
                    <input name="email" value={form.email} onChange={handleChange} className="input-field bg-slate-50" placeholder="john@example.com" />
                  </div>
                  <div className="md:col-span-2 relative">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Full Address</label>
                    <input name="address" value={form.address} onChange={handleChange} className="input-field bg-slate-50" placeholder="Flat, Street, Area" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Pincode</label>
                    <div className="relative">
                      <input name="pincode" value={form.pincode} onChange={handleChange} className="input-field bg-slate-50" placeholder="411014" />
                      {isValidatingPincode && (
                        <div className="absolute right-4 bottom-3 text-blue-600">
                          <Loader2 size={18} className="animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 block mb-2">City</label>
                    <input name="city" value={form.city} onChange={handleChange} className="input-field bg-slate-50" placeholder="Demo City" readOnly />
                  </div>
                  
                  {pincodeError && (
                    <div className="md:col-span-2 p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPinOff size={18} className="text-rose-500" />
                        <span className="font-bold">Not Serviceable</span>
                      </div>
                      <p className="text-rose-700">{pincodeError}</p>
                    </div>
                  )}

                  {!pincodeError && deliveryInfo?.deliveryAvailable && (
                    <div className="md:col-span-2 p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 animate-in fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin size={18} className="text-emerald-500" />
                        <span className="font-bold">Delivery Available</span>
                      </div>
                      <div className="text-sm text-emerald-700">
                        Est. Delivery: <span className="font-bold">{deliveryInfo.eta}</span>
                      </div>
                    </div>
                  )}

                  <button 
                    disabled={!isAddressValid || isValidatingPincode}
                    onClick={() => setStep(2)}
                    className="md:col-span-2 h-14 mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
                  >
                    {!isAvailable ? "Delivery Unavailable" : isValidatingPincode ? "Validating..." : "Continue to Payment"}
                  </button>
                </div>
              )}
              {step === 2 && (
                <div className="text-sm font-medium text-slate-600 bg-slate-50 p-4 rounded-xl">
                  {form.name} • {form.phone} <br />
                  {form.address}, {form.city} - {form.pincode}
                  <button onClick={() => setStep(1)} className="text-blue-600 font-bold ml-3 hover:underline">Edit</button>
                </div>
              )}
            </div>

            {/* ── STEP 2: PAYMENT ── */}
            {step === 2 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl shadow-slate-200/40 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">2</div>
                  <h3 className="text-xl font-bold text-slate-900">Payment Method</h3>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { id: 'demopayment', label: 'Online Payment', desc: 'UPI, Cards, Net Banking', icon: '💳' }
                  ].map(method => (
                    <label 
                      key={method.id}
                      className="flex items-center p-4 md:p-5 rounded-2xl border-2 border-blue-500 bg-blue-50/50 transition-all cursor-default"
                    >
                      <div className="text-2xl mr-4">{method.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-blue-900">{method.label}</div>
                        <div className="text-[11px] font-medium text-blue-600 mt-0.5">{method.desc}</div>
                      </div>
                      <div className="h-6 w-6 rounded-full border-2 flex items-center justify-center border-blue-600">
                        <div className="h-3 w-3 rounded-full bg-blue-600" />
                      </div>
                    </label>
                  ))}
                </div>

                {errorMessage && <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-bold">{errorMessage}</div>}

                <button 
                  disabled={processing}
                  onClick={handleOnlinePayment}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-70 shadow-lg shadow-blue-500/30 text-base"
                >
                  {processing ? 'Processing Securely...' : `Pay ${formatCurrency(total)}`}
                </button>
              </div>
            )}
          </div>

          {/* ── SIDEBAR: SUMMARY ── */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white sticky top-28 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
              <div className="space-y-4 max-h-[320px] overflow-y-auto custom-scrollbar pr-3 mb-6 border-b border-slate-700 pb-6">
                {cart.map(item => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex gap-4">
                    <div className="h-14 w-14 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                       <img src={item.image} className="w-full h-full object-contain mix-blend-screen bg-white" alt="" />
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-bold text-slate-100 truncate">{item.name}</div>
                      <div className="text-slate-400 font-medium mt-1">{item.variantLabel} × {item.quantity}</div>
                    </div>
                    <div className="font-bold text-sm text-white">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-3.5 text-xs font-medium text-slate-300 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white">{formatCurrency(subtotal)}</span>
                </div>
                {gstTotal > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="text-white">{formatCurrency(gstTotal)}</span>
                  </div>
                )}
                
                {/* ── COUPON SECTION ── */}
                <div className="py-5 border-y border-slate-700 my-4 space-y-4">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={couponCode} 
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="PROMO CODE"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs uppercase font-bold outline-none focus:border-blue-500 transition-colors text-white placeholder:text-slate-500"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={validatingCoupon || !couponCode.trim()}
                        className="bg-blue-600 text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 hover:bg-blue-500 transition-colors"
                      >
                        {validatingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between animate-in zoom-in-95 duration-300">
                      <div>
                        <div className="text-xs font-bold text-emerald-400 uppercase">Code: {appliedCoupon.code}</div>
                        <div className="text-[10px] text-emerald-400/80 font-medium mt-0.5">Applied successfully</div>
                      </div>
                      <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-white transition-colors">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <div className="text-[11px] font-bold text-rose-400 px-1 animate-in fade-in">
                      {couponError}
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>Discount</span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}

                  <button 
                    onClick={() => setShowOffers(true)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:bg-blue-500/10 transition-colors rounded-xl border border-blue-500/20 bg-blue-500/5"
                  >
                    <Tag size={12} /> View Offers
                  </button>
                </div>

                <div className="flex justify-between items-center py-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Truck size={12} /> Shipping
                    </span>
                  </div>
                  <span className={deliveryFee === 0 ? "text-emerald-400 font-bold" : "text-white"}>
                    {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold pt-6 border-t border-slate-700">
                <span className="text-white">Total</span>
                <span className="text-blue-400">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {showOffers && (
          <AvailableCoupons 
            subtotal={subtotal} 
            onApply={handleApplyAvailableCoupon} 
            onClose={() => setShowOffers(false)} 
            userId={user?.userId || user?._id}
          />
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;
