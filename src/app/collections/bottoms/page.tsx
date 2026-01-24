import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { bottomsProducts } from "@/data/products";

export default function BottomsPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Bottoms</h1>
        <p className="text-center text-[var(--text-secondary)] mb-12">
          Quality pants, shorts, and denim for your collection
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bottomsProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              hoverImage={product.hoverImage}
              href={product.href}
              discount={product.discount}
              soldOut={product.soldOut}
            />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
