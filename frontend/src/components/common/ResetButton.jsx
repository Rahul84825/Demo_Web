import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { demoDb } from "../../demo/demoDb";

function ResetButton() {
  useEffect(() => {
    // Show toast after reload if flagged in sessionStorage
    const showToast = sessionStorage.getItem("demomart_reset_toast");
    if (showToast) {
      toast.success("Demo database reset to default seed data!");
      sessionStorage.removeItem("demomart_reset_toast");
    }
  }, []);

  const handleReset = () => {
    // 1. Reset database in localStorage
    demoDb.resetDemoData();

    // 2. Clear all cart keys in localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("demo-mart-cart-")) {
        localStorage.removeItem(key);
      }
    });

    // 3. Set toast flag for post-reload display
    sessionStorage.setItem("demomart_reset_toast", "true");

    // 4. Force reload to reinitialize all context states
    window.location.reload();
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 group">
      {/* Tooltip */}
      <span className="absolute left-14 bottom-3 scale-0 transition-all rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white group-hover:scale-100 shadow-md pointer-events-none whitespace-nowrap">
        Reset Demo Data
      </span>
      {/* Floating Button */}
      <button
        onClick={handleReset}
        className="w-12 h-12 bg-white text-indigo-600 border border-slate-200 hover:border-indigo-100 hover:bg-indigo-50 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:rotate-180 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Reset database to default seed data"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </button>
    </div>
  );
}

export default ResetButton;
