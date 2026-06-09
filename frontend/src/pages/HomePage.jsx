import HeroSection from "../components/HeroSection";
import CategoryCarousel from "../components/CategoryCarousel";
import NewArrivals from "../components/NewArrivals";
import OurJourney from "../components/OurJourney";
import OffersSection from "../components/home/OffersSection";
import RecentlyViewed from "../components/RecentlyViewed";
import SignatureSweets from "../components/SignatureSweets";
import TrustSignals from "../components/TrustSignals";
import Newsletter from "../components/Newsletter";
import { SEO } from "../components/common";

function HomePage({ showHero = true, initialCategory = "all", catalogTitle = "New Arrivals" }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "DemoMart",
    "image": "https://demomart.com/favicon.png",
    "@id": "https://demomart.com",
    "url": "https://demomart.com",
    "telephone": "+91 99999 99999",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Demo Address Line 1, Konark Nagar, Demo City",
      "addressLocality": "Demo City",
      "postalCode": "411014",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "22:30"
    }
  };

  return (
    <div className="page-enter bg-[var(--cream)]">
      <SEO 
        title="Best Authentic Indian Sweets in Demo City, Demo City"
        description="Discover the finest collection of authentic Indian sweets, dry fruit product, and traditional treats at DemoMart, Demo City. Freshly prepared daily."
        canonical="/"
        schemaData={schemaData}
      />
      {showHero && <HeroSection />}
      {showHero && <OffersSection />}
      {showHero && <CategoryCarousel />}
      {showHero && <SignatureSweets />}
      <NewArrivals initialCategory={initialCategory} title={catalogTitle} />
      {showHero && <TrustSignals />}
      {showHero && <RecentlyViewed />}
      <OurJourney />
      {showHero && <Newsletter />}
    </div>
  );
}

export default HomePage;
