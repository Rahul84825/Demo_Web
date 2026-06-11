import { PackageX } from "lucide-react";
import ProductCard from "./ProductCard";
import { useProducts } from "../context/ProductContext";

const ProductCardSkeleton = () => (
  <div className="w-full max-w-[320px] flex animate-pulse flex-col overflow-hidden rounded-2xl bg-white border border-[#E2E8F0]">
    <div className="aspect-[4/5] w-full bg-[#F1F5F9]" />
    <div className="flex flex-col gap-3 p-4">
      <div className="h-3.5 bg-[#E2E8F0] rounded-full w-3/4" />
      <div className="h-3 bg-[#E2E8F0] rounded-full w-1/2" />
      <div className="mt-1 flex gap-2">
        <div className="h-6 w-14 bg-[#E2E8F0] rounded-md" />
        <div className="h-6 w-14 bg-[#E2E8F0] rounded-md" />
      </div>
      <div className="h-5 bg-[#E2E8F0] rounded-full w-1/3" />
      <div className="h-px bg-[#E2E8F0]" />
      <div className="h-12 bg-[#E2E8F0] rounded-xl w-full" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full flex items-center justify-center py-20 text-center">
    <div className="flex flex-col items-center gap-3">
      <PackageX className="h-7 w-7 text-[#64748B]" />
      <h3 className="text-[15px] font-medium text-[#0F172A]">No products found</h3>
    </div>
  </div>
);

const ProductGrid = ({ products, loading = false }) => {
  const { products: contextProducts } = useProducts();
  const rawProducts = Array.isArray(products) ? products : (Array.isArray(contextProducts) ? contextProducts : []);
  const resolvedProducts = rawProducts.filter(p => p.isActive !== false);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 justify-items-center">
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
        : resolvedProducts.length === 0
        ? <EmptyState />
        : resolvedProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))
      }
    </div>
  );
};

export default ProductGrid;