import React, { useState, useEffect } from "react";
import { Ticket, X, Check, Loader2, Info } from "lucide-react";
import api, { getApiErrorMessage } from "../../services/api";
import { formatCurrency } from "shared/utils/pricing";

const AvailableCoupons = ({ subtotal, onApply, onClose, userId }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/coupons/available${userId ? `?userId=${userId}` : ''}`);
        if (data.success) {
          setCoupons(data.coupons);
        }
      } catch (err) {
        setError(getApiErrorMessage(err, "Failed to load offers"));
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCoupons();
  }, []);

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-blue-600/60 backdrop-blur-md px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[var(--cream)]/30">
          <div>
            <h3 className="text-xl  text-slate-900">Available Offers</h3>
            <p className="text-[10px] uppercase tracking-widest text-[#4F46E5] font-black mt-0.5 flex items-center gap-1.5">
              <Info size={10} /> Extra savings for you
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin mx-auto text-[var(--burgundy)] mb-3" size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fetching best offers...</p>
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500 text-xs font-bold uppercase">{error}</div>
          ) : coupons.length === 0 ? (
            <div className="py-20 text-center">
              <Ticket size={40} className="mx-auto text-[var(--surface-border)] mb-4 opacity-40" />
              <p className="text-sm font-medium text-slate-500">No offers available at the moment.</p>
            </div>
          ) : (
            coupons.map((coupon) => {
              const isEligible = subtotal >= coupon.minOrderAmount;
              
              return (
                <div 
                  key={coupon.code}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition-all p-5 ${
                    isEligible 
                    ? 'border-[#E2E8F0] bg-white hover:border-[var(--burgundy)] cursor-pointer' 
                    : 'border-[#E2E8F0] bg-[#fdfaf5] opacity-80'
                  }`}
                  onClick={() => isEligible && onApply(coupon.code)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-50 text-slate-900 text-[10px] font-black tracking-widest uppercase mb-2">
                        <Ticket size={10} /> {coupon.code}
                      </div>
                      <h4 className="text-base font-black text-slate-900">
                        {coupon.discountType === "PERCENTAGE" 
                          ? `${coupon.discountValue}% OFF` 
                          : `${formatCurrency(coupon.discountValue)} OFF`
                        }
                      </h4>
                    </div>
                    {isEligible ? (
                      <button 
                        className="bg-[var(--burgundy)] text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          onApply(coupon.code);
                        }}
                      >
                        Apply
                      </button>
                    ) : (
                      <div className="text-[9px] font-black uppercase tracking-tighter text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                        ₹{coupon.minOrderAmount - subtotal} more needed
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed pr-8">
                    {coupon.description || `Get ${coupon.discountType === 'PERCENTAGE' ? coupon.discountValue + '%' : formatCurrency(coupon.discountValue)} discount on your order.`}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#E2E8F0]/40 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-[#4F46E5]">
                    <span>Min Order: {formatCurrency(coupon.minOrderAmount)}</span>
                    {coupon.maxDiscount > 0 && <span>Max Discount: {formatCurrency(coupon.maxDiscount)}</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-[#fdfaf5] border-t border-[#E2E8F0]/50 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] opacity-60">
            Apply a coupon to unlock extra savings!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailableCoupons;


