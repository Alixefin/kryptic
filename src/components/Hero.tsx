"use client";

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://ext.same-assets.com/1808662203/1860402703.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10" />
    </section>
  );
}
