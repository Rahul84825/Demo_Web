import { useEffect } from "react";

function GlobalStyle() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      
      :root {
        --primary: #6366F1;
        --secondary: #0F172A;
        --accent: #6366F1;
        --background: #F8FAFC;
        --surface: #ffffff;
        --surface-strong: #EEF2FF;
        --surface-border: #E2E8F0;
        --charcoal: #0F172A;
        --muted: #64748B;
        
        /* Legacy Branding Mapped to Tech-Forward Palette */
        --burgundy: var(--primary);
        --gold: var(--accent);
        --cream: var(--background);
        
        /* Compact Spacing System */
        --section-py: 64px;
        --section-py-mobile: 48px;
        --container-px: 32px;
        --container-px-mobile: 20px;
        --card-gap: 24px;
        --card-gap-mobile: 16px;
      }

      *, *::before, *::after { box-sizing: border-box; }
      
      html { 
        background: var(--background); 
        scroll-behavior: smooth;
      }
      
      body { 
        margin: 0; 
        font-family: 'Inter', sans-serif; 
        background-color: var(--background);
        color: var(--charcoal); 
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }

      #root { min-height: 100vh; }

      /* Standardized Section Titles — ALWAYS Left Aligned */
      .section-title {
        text-align: left !important;
        margin-bottom: clamp(24px, 4vw, 32px);
      }
      
      .section-title h2 {
        font-family: 'Inter', sans-serif;
        font-size: clamp(24px, 5vw, 40px);
        font-weight: 600;
        color: var(--charcoal);
        line-height: 1.1;
        position: relative;
        padding-bottom: 12px;
        margin: 0;
      }
      
      .section-title h2::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 40px;
        height: 3px;
        background: var(--accent);
        border-radius: 10px;
      }

      .section-title p {
        font-size: clamp(13px, 2vw, 15px);
        color: var(--muted);
        margin-top: 10px;
        font-weight: 500;
        max-width: 600px;
        line-height: 1.6;
      }

      /* Consistent Responsive Grid System */
      .responsive-grid {
        display: grid;
        gap: var(--card-gap-mobile);
        grid-template-columns: repeat(2, 1fr);
        width: 100%;
      }

      @media (min-width: 640px) {
        .responsive-grid {
          gap: var(--card-gap);
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 768px) {
        .responsive-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (min-width: 1024px) {
        .responsive-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (min-width: 1280px) {
        .responsive-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (min-width: 1536px) {
        .responsive-grid {
          grid-template-columns: repeat(5, 1fr);
        }
      }

      /* UI Polishing */
      .card-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .card-hover:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
      }

      .btn-primary {
        background: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        padding: 10px 20px;
        border-radius: 8px;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .btn-primary:hover {
        background: #4F46E5;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
      }
      .btn-primary:active { transform: translateY(0); }
      .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

      .btn-outline {
        background: transparent;
        border: 1.5px solid var(--primary);
        color: var(--primary);
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        padding: 8px 18px;
        border-radius: 8px;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .btn-outline:hover { background: var(--primary); color: white; }

      .input-field {
        width: 100%;
        border: 1.5px solid var(--surface-border);
        background: var(--surface);
        padding: 10px 14px;
        border-radius: 8px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        color: var(--charcoal);
        outline: none;
        transition: all 0.2s;
      }
      .input-field:focus { 
        border-color: var(--primary); 
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
      }

      .page-enter { animation: fadeUp 0.4s ease forwards; }
      @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

      .pattern-bg {
        background-color: var(--background);
        background-image: radial-gradient(circle, var(--surface-border) 1px, transparent 1px);
        background-size: 24px 24px;
      }

      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: var(--background); }
      ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }
      
      /* Custom Scrollbar for Containers */
      .custom-scrollbar::-webkit-scrollbar { width: 4px; }
      .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--surface-border); border-radius: 10px; }

      /* Marquee Animation */
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        display: inline-flex;
        animation: marquee 25s linear infinite;
      }
      .animate-marquee:hover {
        animation-play-state: paused;
      }
      .animate-marquee-slow {
        display: inline-flex;
        animation: marquee 20s linear infinite;
      }
      .animate-marquee-slow:hover {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return null;
}

export default GlobalStyle;
