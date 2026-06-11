import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { calculateTotals, formatCurrency, TAX_MESSAGE } from "shared/utils/pricing";
import { checkDeliveryAvailability, getApiErrorMessage } from "../services/api";
import { MapPin, Truck, Loader2, Info, ArrowRight } from "lucide-react";

function CartPage() {
  const { cart, dispatch } = useCart();
  const navigate = useNavigate();

  // ── DELIVERY ESTIMATION STATES ──
  const [pincode, setPincode] = useState(localStorage.getItem("demo-mart-last-pincode") || "");
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  const { 
    subtotal, 
    deliveryFee, 
    total, 
    deliveryThreshold,
    deliveryLabel 
  } = calculateTotals(cart, {
    pincode: pincode,
    // Override with real fee from backend if available
    manualShipping: deliveryInfo?.deliveryAvailable ? deliveryInfo.deliveryFee : null
  });

  const amountNeeded = Math.max(0, deliveryThreshold - subtotal);

  // ── EFFECT: Validate Pincode ──
  useEffect(() => {
    async function validate() {
      const pc = String(pincode).trim();
      if (pc.length !== 6) {
        setDeliveryInfo(null);
        setPincodeError("");
        return;
      }

      setIsValidating(true);
      setPincodeError("");
      try {
        const data = await checkDeliveryAvailability(pc);
        if (data.success) {
          setDeliveryInfo(data);
          if (!data.deliveryAvailable) {
            setPincodeError(data.message || "Delivery unavailable.");
          } else {
            localStorage.setItem("demo-mart-last-pincode", pc);
          }
        }
      } catch (err) {
        setPincodeError(getApiErrorMessage(err));
      } finally {
        setIsValidating(false);
      }
    }
    validate();
  }, [pincode]);

  if (cart.length === 0) {
    return (
      <div className="page-enter min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 py-20 bg-slate-50">
        <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 text-slate-300">
          <ShoppingBag size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Your cart is empty</h2>
          <p className="text-slate-500 font-medium">Add some premium products to get started.</p>
        </div>
        <button 
          className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95 mt-4" 
          onClick={() => navigate("/")}
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter bg-slate-50 min-h-[60vh] px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Your Cart
          </h1>
          
          <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-7 w-7 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                  {i}
                </div>
              ))}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">3-Step Fast Checkout</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* Items column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={`${item.productId}::${item.variantId}`}
                className="group bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:row gap-5 items-start sm:items-center"
              >
                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain mix-blend-multiply p-2"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1.5 truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                      {item.variantLabel || "Regular"}
                    </span>
                    <span className="text-xs font-medium text-slate-400">{item.category}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-6">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: { ...item, quantity: item.quantity - 1 }
                        })
                      }
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900 text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_QUANTITY",
                          payload: { ...item, quantity: item.quantity + 1 }
                        })
                      }
                      className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <div className="font-extrabold text-lg text-slate-900">
                      {formatCurrency((Number(item?.price) || 0) * item.quantity)}
                    </div>
                    <button
                      onClick={() =>
                        dispatch({ type: "REMOVE_ITEM", payload: item })
                      }
                      className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase tracking-widest mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar / Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50 lg:sticky lg:top-24">
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-4">
                Order Summary <div className="h-px flex-1 bg-slate-100" />
              </h2>

              <div className="space-y-6 mb-8">
                {/* ── DELIVERY ESTIMATOR ── */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Estimate Delivery</label>
                    {isValidating && <Loader2 size={14} className="animate-spin text-blue-600" />}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-Digit Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all shadow-sm"
                    />
                  </div>
                  {pincodeError ? (
                    <p className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                      <Info size={14} /> {pincodeError}
                    </p>
                  ) : deliveryInfo?.deliveryAvailable ? (
                    <div className="text-[11px] font-bold text-emerald-600 flex flex-col gap-1">
                      <span className="uppercase tracking-widest flex items-center gap-1"><Truck size={12}/> Available in {deliveryInfo.area}</span>
                      <span className="text-emerald-600/70 font-medium">Est. Time: {deliveryInfo.eta}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] font-medium text-slate-400">Enter pincode for accurate shipping fees.</p>
                  )}
                </div>

                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span className="uppercase tracking-widest">Subtotal</span>
                  <span className="text-slate-900">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <div className="flex flex-col">
                    <span className="uppercase tracking-widest">Delivery</span>
                    <span className="text-[10px] font-medium text-slate-400 mt-0.5">{pincode ? deliveryLabel : "Calculated at checkout"}</span>
                  </div>
                  {!pincode ? (
                    <span className="font-extrabold text-slate-300">--</span>
                  ) : deliveryFee === 0 ? (
                    <span className="font-extrabold text-emerald-500">FREE</span>
                  ) : (
                    <span className="text-slate-900">{formatCurrency(deliveryFee)}</span>
                  )}
                </div>

                {deliveryFee > 0 && amountNeeded > 0 && (
                  <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-xl text-center">
                    <p className="text-xs font-medium text-emerald-700 leading-relaxed">
                      Add <span className="font-bold">{formatCurrency(amountNeeded)}</span> more for <span className="font-bold underline underline-offset-2">FREE DELIVERY</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-6 border-t border-slate-200 mb-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-3xl font-extrabold text-blue-600 tracking-tight">
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="text-[10px] font-medium text-slate-400 text-right">
                  {TAX_MESSAGE}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3.5">
                <button
                  disabled={pincodeError || isValidating}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
                <button
                  className="w-full py-4 rounded-xl border-2 border-slate-200 font-bold text-[11px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
