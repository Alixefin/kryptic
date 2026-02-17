"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function Hero() {
  const slides = useQuery(api.hero.list);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  // Loading state or fallback to static content if no slides
  if (slides === undefined) {
    return (
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-[var(--bg-secondary)] animate-pulse" />
    );
  }

  if (slides.length === 0) {
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

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-[var(--bg-secondary)] group">
      {slides.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Background Image */}
          {slide.imageUrl ? (
            <div className="absolute inset-0">
              <Image
                src={slide.imageUrl}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)]" />
          )}

          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center px-4 max-w-4xl mx-auto">
              <h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {slide.title}
              </h1>
              <p className="text-lg md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto drop-shadow-md">
                {slide.subtitle}
              </p>
              <Link
                href={slide.ctaLink}
                className="btn-primary inline-block text-lg px-10 py-4 shadow-xl hover:scale-105 transition-transform"
              >
                {slide.ctaText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
                }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-30"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-30"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}
    </section>
  );
}
