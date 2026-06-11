import { ORDER_TABS } from "./orderUtils";

const OrderTabs = ({ activeTab, counts, onSelect }) => {
  return (
    <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar no-scrollbar scroll-smooth">
      {ORDER_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts[tab.id] || 0;
        return (
          <button
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all
              ${isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-slate-50 text-[#6d4c41] border-slate-200 hover:bg-slate-50"
              }`}
          >
            <span>{tab.label}</span>
            <span className={`min-w-[26px] rounded-full px-2 py-0.5 text-[11px] ${isActive ? "bg-white/20" : "bg-slate-50"}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default OrderTabs;

