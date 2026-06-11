import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import SectionContainer from "./home/SectionContainer";
import { ArrowRight, Sparkles } from "lucide-react";

function CategoryCarousel() {
  const { categories } = useProducts();
  const navigate = useNavigate();

  const handleCategoryClick = (slug) => {
    navigate(`/products?category=${slug}`);
  };

  const homepageCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories
      .filter((c) => c.is_active !== false && c.showInHomepage)
      .sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by admin order
  }, [categories]);

  if (homepageCategories.length === 0) return null;

  return (
    <section className="py-12 md:py-24 bg-slate-50 relative overflow-hidden">
      <SectionContainer>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="section-title mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold tracking-widest uppercase">
               <Sparkles size={14} /> Top Collections
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="max-w-xl text-sm text-slate-500 mt-2">Explore our curated collections of premium electronics, fashion, and lifestyle products.</p>
          </div>
          
          <button 
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-[11px] md:text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors group uppercase tracking-widest"
          >
            View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {homepageCategories.map((category, idx) => (
            <button
              key={category._id}
              onClick={() => handleCategoryClick(category.slug)}
              style={{ animationDelay: `${idx * 80}ms` }}
              className="group relative w-full h-36 sm:h-44 lg:h-48 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3"
            >
              <div className="absolute inset-0 p-4 pb-12 flex items-center justify-center bg-slate-50">
                {category.image ? (
                  <img src={category.image} alt={category.name} className="w-full h-full object-contain mix-blend-multiply opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Sparkles size={20} />
                  </div>
                )}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 text-center transition-all duration-300">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

export default CategoryCarousel;

