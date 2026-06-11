import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import SectionContainer from "./home/SectionContainer";
import { useProducts } from "../context/ProductContext";
import { Sparkles, ArrowRight } from "lucide-react";

const SignatureSweets = () => {
  const { products: contextProducts, loading } = useProducts();
  const navigate = useNavigate();
  
  const allProducts = Array.isArray(contextProducts) ? contextProducts : [];

  const signatureProducts = useMemo(() => {
    return allProducts.filter(p => p.isSignature && p.isActive !== false).slice(0, 4);
  }, [allProducts]);

  if (!loading && signatureProducts.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-[500px] w-[500px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <SectionContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
          <div className="section-title mb-0 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold tracking-widest uppercase">
              <Sparkles size={12} /> Masterpiece Collection
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Signature Items</h2>
            <p className="max-w-xl text-sm md:text-base text-slate-500 mt-2">Our most beloved premium products, crafted with perfection and cutting-edge design.</p>
          </div>
          
          <button 
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-xs md:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors group uppercase tracking-widest"
          >
            Explore All <span className="hidden sm:inline">Items</span> <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="responsive-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-white rounded-2xl md:rounded-3xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="responsive-grid">
            {signatureProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
};

export default SignatureSweets;


