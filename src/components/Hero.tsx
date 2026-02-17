"use client";

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-[var(--bg-secondary)]">
      {/* Clean brand hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center px-4">
          <h1
            className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] mb-4 tracking-tight"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            KRYPTIC LAB
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
            Premium streetwear crafted with excellence. Discover our exclusive collection.
          </p>
          <a
            href="/collections"
            className="btn-primary inline-block text-lg px-8 py-3"
          >
            SHOP NOW
          </a>
        </div>
      </div>
    </section>
  );
}
