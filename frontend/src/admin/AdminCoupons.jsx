import React, { useState, useEffect } from "react";
import { 
  Ticket, Plus, Trash2, Search, Calendar, 
  Percent, DollarSign, Clock, CheckCircle2, X 
} from "lucide-react";
import api, { getApiErrorMessage } from "../services/api";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiresAt: "",
    usageLimit: "",
    description: "",
    showOnCheckout: false
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/coupons");
      if (data.success) setCoupons(data.coupons);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to load coupons"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await api.post("/api/coupons", form);
      if (data.success) {
        setCoupons(prev => [data.coupon, ...prev]);
        setShowAddModal(false);
        setForm({ code: "", discountType: "PERCENTAGE", discountValue: "", minOrderAmount: "", maxDiscount: "", expiresAt: "", usageLimit: "", description: "", showOnCheckout: false });
      }
    } catch (err) {
      alert(getApiErrorMessage(err, "Failed to create coupon"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const { data } = await api.delete(`/api/coupons/${id}`);
      if (data.success) setCoupons(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert(getApiErrorMessage(err, "Failed to delete coupon"));
    }
  };

  if (loading) return <div className="p-10 text-center text-xs font-bold uppercase tracking-widest text-slate-500">Loading coupons...</div>;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl md:text-2xl  font-medium text-slate-900">Promo Codes</h2>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1 opacity-70">Manage discounts & offer codes</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="h-11 px-6 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-[0.1em] text-[10px] hover:bg-blue-600 transition-all shadow-md active:scale-95"
        >
          <Plus size={14} /> New Coupon
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-[10px] font-bold uppercase tracking-widest">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map(coupon => (
          <div key={coupon._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute -top-2 -right-2 p-4 opacity-5 text-slate-900 group-hover:scale-110 transition-transform">
              <Ticket size={60} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col gap-1">
                  <span className="bg-slate-50 text-slate-900 px-2.5 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase border border-slate-200 w-fit">
                    {coupon.code}
                  </span>
                  {coupon.showOnCheckout && (
                    <span className="flex items-center gap-1 text-[8px] font-black text-emerald-600 uppercase tracking-widest">
                      <Clock size={8} /> Visible on Checkout
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => handleDeleteCoupon(coupon._id)}
                  className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h4 className="text-lg font-black text-slate-900 mb-0.5">
                {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
              </h4>
              <p className="text-[10px] text-slate-500 mb-5 font-bold uppercase tracking-tight opacity-80">{coupon.description || "Special promotional offer."}</p>

              <div className="mt-auto pt-4 border-t border-slate-200/40 grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-[#4F46E5] uppercase tracking-tighter">
                  <Calendar size={12} className="opacity-70" /> {new Date(coupon.expiresAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-[#4F46E5] uppercase tracking-tighter">
                  <CheckCircle2 size={12} className="opacity-70" /> Min: ₹{coupon.minOrderAmount}
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-[#4F46E5] uppercase tracking-tighter">
                  <Search size={12} className="opacity-70" /> Used: {coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}
                </div>
                {coupon.maxDiscount && (
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-[#4F46E5] uppercase tracking-tighter">
                    <DollarSign size={12} className="opacity-70" /> Cap: ₹{coupon.maxDiscount}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {coupons.length === 0 && !loading && (
        <div className="py-16 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-200">
          <Ticket size={32} className="text-cyan-500 mx-auto mb-4 opacity-40" />
          <h3 className=" text-xl text-slate-900">No Coupons</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Create your first promo code to get started.</p>
        </div>
      )}

      {/* ── CREATE MODAL ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-blue-600/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg bg-slate-50 rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-200/50 flex items-center justify-between bg-slate-50/30">
              <div>
                <h3 className="text-xl  text-slate-900">New Promo Code</h3>
                <p className="text-[9px] uppercase tracking-widest text-[#4F46E5] font-black mt-0.5">Configure discount parameters</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-500">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-8 overflow-y-auto max-h-[80vh] custom-scrollbar space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block mb-1.5 ml-1">Coupon Code</label>
                  <input required name="code" value={form.code} onChange={handleInputChange} className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-xs font-black text-slate-900 uppercase focus:border-blue-500 outline-none transition-all" placeholder="WELCOME10" />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block mb-1.5 ml-1">Type</label>
                  <select name="discountType" value={form.discountType} onChange={handleInputChange} className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 focus:border-blue-500 outline-none">
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block mb-1.5 ml-1">Value</label>
                  <input required type="number" name="discountValue" value={form.discountValue} onChange={handleInputChange} className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 focus:border-blue-500 outline-none" placeholder="10" />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block mb-1.5 ml-1">Min Order (₹)</label>
                  <input type="number" name="minOrderAmount" value={form.minOrderAmount} onChange={handleInputChange} className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 focus:border-blue-500 outline-none" placeholder="500" />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block mb-1.5 ml-1">Max Discount (₹)</label>
                  <input type="number" name="maxDiscount" value={form.maxDiscount} onChange={handleInputChange} className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 focus:border-blue-500 outline-none" placeholder="200" />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block mb-1.5 ml-1">Expiry Date</label>
                  <input required type="date" name="expiresAt" value={form.expiresAt} onChange={handleInputChange} className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 focus:border-blue-500 outline-none" />
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block mb-1.5 ml-1">Usage Limit</label>
                  <input type="number" name="usageLimit" value={form.usageLimit} onChange={handleInputChange} className="w-full h-12 rounded-xl border-2 border-slate-200 bg-white px-4 text-xs font-bold text-slate-900 focus:border-blue-500 outline-none" placeholder="100" />
                </div>

                <div className="col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-[#4F46E5] block mb-1.5 ml-1">Description</label>
                  <textarea name="description" value={form.description} onChange={handleInputChange} className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-xs font-medium text-slate-900 h-20 outline-none focus:border-blue-500" placeholder="Short description..."></textarea>
                </div>

                <div className="col-span-2 flex items-center gap-3 bg-white p-4 rounded-xl border-2 border-slate-200">
                  <input 
                    type="checkbox" 
                    id="showOnCheckout" 
                    name="showOnCheckout" 
                    checked={form.showOnCheckout} 
                    onChange={handleInputChange}
                    className="h-5 w-5 accent-emerald-600 rounded border-slate-200"
                  />
                  <label htmlFor="showOnCheckout" className="text-[10px] font-black uppercase tracking-widest text-slate-900 cursor-pointer select-none">
                    Show On Checkout
                    <span className="block text-[8px] font-bold text-[#4F46E5] lowercase opacity-70">Customers can see and apply this from the checkout page.</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 h-12 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] h-12 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95 disabled:opacity-50">
                  {isSubmitting ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;

