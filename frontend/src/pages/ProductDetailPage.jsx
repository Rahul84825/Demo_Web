import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, ChevronLeft, ShieldCheck, Truck, RefreshCw, Star, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { formatCurrency, TAX_MESSAGE } from "shared/utils/pricing";
import { toast } from "react-toastify";
import SimilarProducts from "../components/SimilarProducts";
import SectionContainer from "../components/home/SectionContainer";
import { SEO } from "../components/common";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { user, isAuthenticated } = useAuth();
  const { dispatch, openCart } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const product = useMemo(() => products.find(p => p._id === id), [products, id]);

  const categoryName = useMemo(() => product?.category?.name || "Premium Collection", [product]);
  
  const availableVariants = useMemo(() => 
    (product?.variants || []).filter(v => v.isActive !== false),
  [product]);

  useEffect(() => {
    if (product && !selectedVariant) {
      if (availableVariants.length > 0) {
        setSelectedVariant(availableVariants[0]);
      }
    }
  }, [product, availableVariants, selectedVariant]);

  const currentPrice = selectedVariant?.sellingPrice || product?.basePrice || 0;
  const currentMrp = selectedVariant?.mrp || product?.mrp || 0;
  const currentStock = selectedVariant ? selectedVariant.stock : product?.stock || 0;
  const isOutOfStock = currentStock <= 0 || product?.isActive === false;
  const isLowStock = !isOutOfStock && currentStock < 10;

  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category?._id === product.category?._id && p._id !== product._id)
      .slice(0, 4);
  }, [product, products]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please login to continue.");
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (!product) return;

    const variant = selectedVariant || {
      _id: "default",
      label: "Default",
      sellingPrice: product.price || product.basePrice,
      stock: product.stock
    };

    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product._id,
        variantId: variant._id,
        variantLabel: variant.label,
        name: product.name,
        price: variant.sellingPrice,
        image: product.images?.[0] || product.image,
        quantity: quantity,
        stock: variant.stock,
        gstRate: product.gstPercent || 0,
        packingCharges: product.packingCharges || 0
      }
    });

    openCart();
  };

  const schemaData = useMemo(() => {
    if (!product) return null;
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images || [product.image],
      "description": product.description || `Premium ${product.name} from DemoMart.`,
      "sku": product._id,
      "brand": {
        "@type": "Brand",
        "name": "DemoMart"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://demomart.com/product/${product._id}`,
        "priceCurrency": "INR",
        "price": selectedVariant?.sellingPrice || product.basePrice,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    };
  }, [product, selectedVariant]);

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 animate-pulse text-2xl font-extrabold text-slate-900 tracking-tight">Loading product...</div>;
  if (!product) return <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 text-2xl font-extrabold text-slate-900 tracking-tight">Product not found.</div>;

  return (
    <div className="page-enter bg-white min-h-[60vh] pb-20">
      <SEO 
        title={product.name}
        description={product.description?.substring(0, 160) || `Buy premium ${product.name} online at DemoMart. Fast delivery in Demo City.`}
        canonical={`/product/${product._id}`}
        ogImage={product.images?.[0] || product.image}
        ogType="product"
        schemaData={schemaData}
      />
      <SectionContainer>
        {/* ── BREADCRUMB ── */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 mb-8 hover:text-blue-600 transition-colors pt-6">
          <ChevronLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* ── IMAGES (Sticky Left) ── */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="aspect-[4/5] lg:aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center group p-8">
                <img src={product.images[activeImage]} alt="" className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-700 ${isOutOfStock ? 'opacity-40' : 'group-hover:scale-105'}`} />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {product.images.map((img, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveImage(i)}
                      className={`h-24 w-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50 p-2
                        ${activeImage === i ? 'border-blue-600 shadow-lg scale-95' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── CONTENT (Scrollable Right) ── */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:pt-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4 bg-blue-50 w-fit px-3 py-1 rounded-full">
                <Star size={12} fill="currentColor" /> {categoryName}
              </div>
              <h1 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>{product.name}</h1>
              
              <div className="flex items-baseline gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-3xl font-extrabold tracking-tight ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>
                    {formatCurrency(currentPrice)}
                  </span>
                  {!isOutOfStock && currentMrp > currentPrice && (
                    <span className="text-lg font-bold text-slate-400 line-through opacity-60">
                      {formatCurrency(currentMrp)}
                    </span>
                  )}
                  {!isOutOfStock && selectedVariant?.discountPercent > 0 && (
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md">
                      -{selectedVariant.discountPercent}%
                    </span>
                  )}
                  {selectedVariant && (
                    <span className="text-sm font-bold text-slate-400 align-middle ml-1">
                      / {selectedVariant.label}
                    </span>
                  )}
                </div>
                <div className="flex flex-col w-full mt-1">
                  <span className="text-xs text-slate-500 font-medium">{TAX_MESSAGE}</span>
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100 my-6" />

            <p className="text-slate-600 leading-relaxed mb-8 text-sm md:text-base font-medium">
              {product.description || "A masterfully crafted product designed with premium materials. Perfect for modern lifestyles and daily usage."}
            </p>

            {/* VARIANTS */}
            {availableVariants.length > 1 && (
              <div className="mb-8">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-4">Select Option</h4>
                <div className="flex flex-wrap gap-3">
                  {availableVariants.map((v, i) => {
                    const vOutOfStock = v.stock <= 0;
                    return (
                      <button
                        key={i}
                        disabled={vOutOfStock}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-5 py-3 rounded-xl text-sm font-bold transition-all border-2
                          ${selectedVariant?._id === v._id 
                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl' 
                            : vOutOfStock
                              ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* QUANTITY & ADD */}
            <div className="space-y-6 mt-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="flex items-center justify-between border-2 border-slate-200 rounded-xl bg-white overflow-hidden h-14 px-2 sm:w-32">
                  <button disabled={isOutOfStock} onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 text-slate-600 font-bold"><Minus size={18} /></button>
                  <span className={`w-10 text-center text-lg font-bold ${isOutOfStock ? 'text-slate-400' : 'text-slate-900'}`}>{quantity}</span>
                  <button disabled={isOutOfStock} onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50 text-slate-600 font-bold"><Plus size={18} /></button>
                </div>
                
                <button 
                  disabled={isOutOfStock || quantity > currentStock}
                  onClick={handleAddToCart}
                  className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:grayscale disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>{isOutOfStock ? "Sold Out" : "Add to Cart"}</span> <ShoppingBag size={20} />
                </button>
              </div>

              {/* STOCK STATUS */}
              <div className="flex items-center gap-2.5">
                <div className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? 'bg-rose-500' : isLowStock ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className={`text-[11px] font-bold uppercase tracking-widest ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-orange-600' : 'text-slate-500'}`}>
                  {isOutOfStock ? 'Currently Out of Stock' : isLowStock ? `Only ${currentStock} units left` : `In Stock & Ready to Ship`}
                </span>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-4 mt-12 pt-8 border-t border-slate-100">
              {[
                { icon: ShieldCheck, label: "Premium Quality" },
                { icon: Truck, label: "Express Shipping" },
                { icon: RefreshCw, label: "Easy Returns" }
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm">
                    <b.icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIMILAR PRODUCTS */}
        <div className="mt-20 pt-10 border-t border-slate-100">
          <h3 className="text-2xl font-extrabold text-slate-900 mb-8">You might also like</h3>
          <SimilarProducts titleCategory={categoryName} products={similarProducts} />
        </div>
      </SectionContainer>
    </div>
  );
}

export default ProductDetailPage;
