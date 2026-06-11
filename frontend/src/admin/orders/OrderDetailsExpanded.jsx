import { ChevronUp } from "lucide-react";
import { formatCurrency } from "shared/utils/pricing";

const OrderDetailsExpanded = ({ order, isExpanded, onToggle }) => {
  const items = Array.isArray(order.items) ? order.items : [];
  const totals = order.totals || {};
  const paymentMethod = order.payment?.method || order.paymentMethod || "demopayment";
  const notes = order.notes || order.orderNotes || "";

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="overflow-hidden">
      {/* Glassmorphism Container with smooth animation */}
      <div className="mt-3 rounded-lg border border-white/20 bg-white/40 p-4 backdrop-blur-md shadow-lg animate-fade-in transition-all duration-300"
        style={{
          animation: "fadeInSlideDown 0.3s ease-out forwards"
        }}
      >
        <style>{`
          @keyframes fadeInSlideDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
        
        {/* Collapse button */}
        <button
          type="button"
          onClick={onToggle}
          className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-900 hover:text-slate-900 transition-colors"
        >
          <ChevronUp className="h-3.5 w-3.5" />
          Hide Details
        </button>

        {/* Items Section */}
        <div className="mb-4 space-y-2">
          <div className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500 px-2">
            Order Items
          </div>
          <div className="space-y-2.5 bg-white/50 rounded-lg p-3 backdrop-blur-sm">
            {items.length === 0 ? (
              <div className="text-xs text-slate-500">No items in this order</div>
            ) : (
              items.map((item, idx) => (
                <div
                  key={item._id || item.productId || idx}
                  className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/30 last:border-b-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-slate-900 truncate">
                      {item.titleSnapshot || item.name || "Item"}
                    </div>
                    {item.selectedVariant?.label && (
                      <div className="text-xs text-slate-500 mt-0.5">
                        {item.selectedVariant.label}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="text-xs font-medium text-slate-500 bg-white/30 rounded px-2 py-1">
                      {item.quantity}x
                    </div>
                    <div className="font-medium text-sm text-slate-900 min-w-[60px] text-right">
                      {formatCurrency(item.finalAmount || item.price || 0)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-4 space-y-2">
          <div className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500 px-2">
            Pricing
          </div>
          <div className="space-y-1.5 bg-white/50 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Items Subtotal</span>
              <span className="font-medium text-slate-900">
                {formatCurrency(totals.itemsSubtotal || 0)}
              </span>
            </div>
            {Number(totals.gstTotal || 0) > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">GST</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(totals.gstTotal || 0)}
                </span>
              </div>
            )}
            {Number(totals.shippingFee || 0) > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Delivery</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(totals.shippingFee || 0)}
                </span>
              </div>
            )}
            {Number(totals.discountTotal || 0) > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-700">Discount</span>
                <span className="font-medium text-emerald-700">
                  -{formatCurrency(totals.discountTotal || 0)}
                </span>
              </div>
            )}
            <div className="my-2 border-t border-white/40" />
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-900 text-sm">Total</span>
              <span className="font-medium text-slate-900 text-lg">
                {formatCurrency(totals.grandTotal || order.total || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment & Meta Section */}
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500 px-2">
            Details
          </div>
          <div className="space-y-1.5 bg-white/50 rounded-lg p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Payment Method</span>
              <span className="font-medium text-slate-900">{paymentMethod}</span>
            </div>
            {notes && (
              <div className="pt-1.5 border-t border-white/40">
                <div className="text-xs text-slate-500 mb-1">Order Notes</div>
                <div className="text-xs text-slate-900 italic line-clamp-3">{notes}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsExpanded;

