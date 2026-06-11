import { useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, ShoppingBag, ArrowRight, Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { calculateTotals, formatCurrency, TAX_MESSAGE } from "shared/utils/pricing";

function CartDrawer() {
  const { cart, isCartOpen, closeCart, dispatch } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { subtotal, deliveryFee, gstTotal, packingTotal, total } = calculateTotals(cart);

  useEffect(() => {
    if (isCartOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isCartOpen]);

  const updateQty = (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);
    if (item.stock && newQty > item.stock) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { ...item, quantity: newQty } });
  };

  const handleCheckout = () => {
    closeCart();
    if (!isAuthenticated) {
      toast.info("Please login before placing an order.");
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  if (!isCartOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" onClick={closeCart} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        {/* ── HEADER ── */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your Cart</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cart.length} unique items</p>
            </div>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* ── ITEMS ── */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 bg-slate-50">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-sm border border-slate-100">
                <ShoppingCart size={40} strokeWidth={1} />
              </div>
              <h3 className="text-xl mb-2 font-bold text-slate-900">Empty Cart</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium">Add some premium products to get started.</p>
              <button onClick={closeCart} className="btn-outline">Go to Shop</button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-4 group bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="h-20 w-20 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate pr-4">{item.name}</h4>
                    <button 
                      onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item })}
                      className="text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-3">{item.variantLabel}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden h-8">
                      <button onClick={() => updateQty(item, -1)} className="px-2 hover:bg-slate-200 transition-colors font-bold text-slate-600"><Minus size={12} /></button>
                      <span className="w-8 text-center text-xs font-bold text-slate-900">{item.quantity}</span>
                      <button onClick={() => updateQty(item, 1)} className="px-2 hover:bg-slate-200 transition-colors font-bold text-slate-600"><Plus size={12} /></button>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── FOOTER ── */}
        {cart.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-widest">Items Subtotal</span>
                <span className="text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-widest">Delivery</span>
                <span className={deliveryFee === 0 ? "text-emerald-500" : "text-slate-900"}>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
              </div>
              <div className="h-px bg-slate-100 my-3" />
              <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                <span>Total</span>
                <span className="text-2xl text-blue-600 font-extrabold">{formatCurrency(subtotal + deliveryFee)}</span>
              </div>
              <p className="text-[10px] text-right text-slate-400 font-medium mt-1">{TAX_MESSAGE}</p>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-14 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              Checkout Now <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default CartDrawer;


