import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import MessageButton from "@/components/MessageButton";
import SubscribeModal from "@/components/SubscribeModal";
import {
  shirtsProducts,
  bottomsProducts,
  jacketsProducts,
  tshirtsProducts,
  accessoriesProducts,
} from "@/data/products";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />

      {/* Shop Shirts Section */}
      <ProductSection
        title="SHOP SHIRTS"
        products={shirtsProducts}
        viewAllHref="/collections/shirts"
      />

      {/* Shop Bottoms Section */}
      <ProductSection
        title="SHOP BOTTOMS"
        products={bottomsProducts}
        viewAllHref="/collections/bottoms"
      />

      {/* Shop Jackets Section */}
      <ProductSection
        title="SHOP JACKETS"
        products={jacketsProducts}
        viewAllHref="/collections/jackets"
      />

      {/* Shop T-Shirts Section */}
      <ProductSection
        title="SHOP T-SHIRTS"
        products={tshirtsProducts}
        viewAllHref="/collections/t-shirts"
      />

      {/* Shop Accessories Section */}
      <ProductSection
        title="SHOP ACCESSORIES"
        products={accessoriesProducts}
        viewAllHref="/collections/accessories"
      />

      <Newsletter />
      <Footer />

      {/* Floating Button */}
      <MessageButton />

      {/* Subscribe Modal */}
      <SubscribeModal />
    </main>
  );
}
