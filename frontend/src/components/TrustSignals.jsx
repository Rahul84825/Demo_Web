import { ShieldCheck, Truck, Sparkles, Award } from "lucide-react";
import SectionContainer from "./home/SectionContainer";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Premium Quality",
    description: "Curated selection of top-tier products sourced from verified manufacturers."
  },
  {
    icon: Award,
    title: "Authentic Guarantee",
    description: "100% genuine products backed by official manufacturer warranties."
  },
  {
    icon: Truck,
    title: "Swift Delivery",
    description: "Express local shipping and real-time tracking for every order."
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    description: "Industry-standard encryption and fully mocked demo payment flows."
  }
];

const TrustSignals = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-y border-[var(--surface-border)]">
      <SectionContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center group">
              <div className="h-16 w-16 rounded-3xl bg-[var(--cream)] flex items-center justify-center text-[var(--burgundy)] mb-6 transition-transform group-hover:scale-110 duration-300">
                <feature.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className=" text-lg font-medium text-[var(--charcoal)] mb-3">{feature.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
};

export default TrustSignals;

