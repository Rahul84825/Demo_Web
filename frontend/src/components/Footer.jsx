import { NavLink, useNavigate } from "react-router-dom";
import {
  MapPin, Phone, Mail, Clock,
  Instagram, MessageCircle,
  Shield, Truck, RefreshCw,
  ChevronRight,
  Package
} from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "All Products", to: "/products" },
  { label: "My Orders", to: "/my-orders" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const SUPPORT_LINKS = [
  { label: "Shipping Policy", to: "/shipping-policy" },
  { label: "Returns & Exchanges", to: "/returns-exchanges" },
  { label: "Terms & Conditions", to: "/terms-conditions" },
  { label: "Privacy Policy", to: "/privacy-policy" },
];

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Address",
    value: "DemoMart Tech Park, Block A, Cyber City 411014",
    href: null,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 800 555 0199",
    href: "tel:+18005550199",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@demomart.com",
    href: "mailto:support@demomart.com",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon – Sun: 24/7 Online Support",
    href: null,
  },
];

const TRUST_BADGES = [
  { icon: Shield, label: "Secure Payments" },
  { icon: Truck, label: "Fast Nationwide Delivery" },
  { icon: RefreshCw, label: "30-Day Returns" },
];

const SOCIAL = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    href: "#",
    hover: "hover:bg-green-500 hover:border-green-500 hover:text-white",
  },
  {
    icon: Instagram,
    label: "Instagram",
    href: "#",
    hover: "hover:bg-pink-600 hover:border-pink-600 hover:text-white",
  },
];

const Footer = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 pt-16 pb-12">
        {/* Brand row + trust badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-800">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 shrink-0 group transition-all"
          >
            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
              <Package size={24} />
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-2xl font-black tracking-tight text-white">DemoMart</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 mt-1">Tech & Lifestyle</span>
            </div>
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {TRUST_BADGES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <Icon className="h-4 w-4 shrink-0 text-blue-500" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* 4-col grid */}
        <div className="grid grid-cols-1 gap-12 pt-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Col 1 — About + Social */}
          <div className="sm:col-span-2 lg:col-span-4 lg:pr-8">
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-slate-400">
              DemoMart is your ultimate destination for premium electronics, modern lifestyle goods, and everyday essentials. Discover quality products with fast shipping and secure checkout.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(({ icon: Icon, label, href, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 transition-all ${hover}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-100">Explore</h4>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <NavLink
                    to={to}
                    className="group inline-flex items-center text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 shrink-0 text-blue-500 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 mr-1" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Support */}
          <div className="lg:col-span-3">
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-100">Customer Support</h4>
            <ul className="flex flex-col gap-3">
              {SUPPORT_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <NavLink
                    to={to}
                    className="group inline-flex items-center text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <ChevronRight className="h-3 w-3 shrink-0 text-blue-500 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 mr-1" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter/Contact */}
          <div className="lg:col-span-3">
            <h4 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-100">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-4">Subscribe to our newsletter for the latest tech drops and exclusive offers.</p>
            <div className="flex gap-2 mb-8">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                Subscribe
              </button>
            </div>
            
            <ul className="flex flex-col gap-3">
              {CONTACT_INFO.slice(1).map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-slate-400">
                  <Icon className="h-4 w-4 text-slate-500 shrink-0" />
                  {href ? (
                    <a href={href} className="hover:text-blue-400 transition-colors">{value}</a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-slate-500">
              © {year} <span className="font-bold text-slate-300">DemoMart</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <NavLink to="/privacy-policy" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Privacy</NavLink>
              <NavLink to="/terms-conditions" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Terms</NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;