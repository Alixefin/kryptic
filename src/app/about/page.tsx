import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">About Us</h1>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              KRYPTIC was founded with a vision to redefine luxury fashion. We believe that style should be accessible, 
              yet maintain the highest standards of quality and craftsmanship. Our journey began with a simple idea: 
              create clothing that makes people feel confident and exceptional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We are committed to delivering premium fashion pieces that combine modern aesthetics with timeless design. 
              Every item in our collection is carefully curated to ensure it meets our exacting standards for quality, 
              style, and sustainability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Quality & Craftsmanship</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              At KRYPTIC, we partner with skilled artisans and premium manufacturers to create pieces that stand the test of time. 
              We use only the finest materials and pay meticulous attention to every detail, from stitching to finishing touches.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Our Promise</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We promise to continue innovating and pushing the boundaries of fashion while staying true to our core values 
              of quality, authenticity, and customer satisfaction. When you choose KRYPTIC, you choose excellence.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}
