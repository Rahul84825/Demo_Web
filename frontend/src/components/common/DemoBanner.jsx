import React, { useState, useEffect } from "react";

function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem("demomart_banner_dismissed");
    if (isDismissed) {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("demomart_banner_dismissed", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="bg-indigo-600 text-white text-xs md:text-sm py-2 px-4 flex justify-between items-center relative z-50 select-none shadow-sm transition-all duration-300"
      style={{ minHeight: "40px" }}
    >
      <div className="flex-1 flex justify-center items-center gap-2 flex-wrap">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-200"></span>
        </span>
        <span className="font-medium tracking-wide">
          ✨ Demo Mode Active:
        </span>
        <span className="opacity-90">
          All checkouts are mocked. Admin Panel: <strong className="text-white font-semibold">admin@demo.com</strong> / <strong className="text-white font-semibold">demo1234</strong>
        </span>
      </div>
      <button
        onClick={handleDismiss}
        className="text-white opacity-75 hover:opacity-100 transition-opacity ml-3 focus:outline-none p-1"
        aria-label="Dismiss banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default DemoBanner;
