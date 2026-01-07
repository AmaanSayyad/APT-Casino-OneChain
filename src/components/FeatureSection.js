'use client';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FeatureSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [imageError, setImageError] = useState(false);

  const features = [
    {
      id: 1,
      title: "Transparent & Provably Fair",
      description: "All games use verifiable on-chain randomness through our Pyth Entropy, ensuring complete transparency and fairness in every outcome.",
      icon: "🎲"
    },
    {
      id: 2,
      title: "Cross-Chain Liquidity",
      description: "Stake tokens across multiple chains to earn OCT tokens while playing your favorite games with minimal slippage.",
      icon: "⛓️"
    },
    {
      id: 3,
      title: "No Restrictions",
      description: "Enjoy flexible withdrawals, transparent bonus schemes, and full control over your assets through decentralized management.",
      icon: "🔓"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute -top-40 left-20 w-80 h-80 rounded-full bg-sky-500/5 blur-[120px] z-0"></div>
      <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center mb-12 justify-center">
          <div className="w-1 h-6 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mr-3"></div>
          <h2 className="text-2xl font-display font-bold text-white">Key Features of OneArcade</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Casino Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md h-[350px] rounded-xl overflow-hidden bg-gradient-to-br from-sky-800 to-blue-900">
              {!imageError ? (
                <Image
                  src="/images/casino-players.png"
                  alt="Two casino players enjoying a game of poker"
                  fill
                  className="object-cover rounded-xl"
                  priority
                  unoptimized
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="text-5xl mb-4">🎰</div>
                    <h3 className="text-xl font-medium text-white mb-2">APT Casino</h3>
                    <p className="text-white/70">Experience the future of decentralized gaming</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comparison section – OneArcade vs traditional casinos */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#050816] via-[#020617] to-[#020617] border border-sky-500/40 px-6 py-8 md:px-10 md:py-10 shadow-[0_0_40px_rgba(56,189,248,0.35)]">
              {/* soft vignette */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18)_0%,rgba(0,0,0,0)_60%)]" />

              {/* Title */}
              <div className="relative z-10 mb-6">
                <p className="text-sm tracking-[0.25em] uppercase text-sky-300/80 mb-2">
                  Traditional vs OneArcade
                </p>
                <h3 className="text-2xl md:text-3xl font-display font-semibold text-white">
                  A New Era of Fair Gaming
                </h3>
              </div>

              {/* Comparison table – single HUD card like reference image */}
              <div className="relative z-10 mx-auto mt-4 max-w-3xl md:max-w-4xl">
                {/* outer glow */}
                <div className="absolute -inset-[8px] rounded-[22px] bg-[radial-gradient(circle,rgba(56,189,248,0.35)_0%,rgba(15,23,42,0)_65%)] blur-sm" />

                <div className="relative rounded-[22px] border border-cyan-400/70 bg-[#050816]/90 shadow-[0_0_40px_rgba(8,145,178,0.6)] overflow-hidden">
                  {/* header row */}
                  <div className="grid grid-cols-2 text-center text-base md:text-xl font-semibold">
                    <div className="px-6 py-4 md:px-8 md:py-5 bg-gradient-to-br from-slate-600/95 via-slate-700/90 to-slate-800/95 text-white/80">
                      Traditional Casinos
                    </div>
                    <div className="px-6 py-4 md:px-8 md:py-5 bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-500 text-white">
                      OneArcade
                    </div>
                  </div>

                  {/* vertical divider */}
                  <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-cyan-300/60 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />

                  {/* rows */}
                  <div className="relative grid grid-cols-2 text-sm md:text-base">
                    {[
                      {
                        left: "Hidden RNG algorithms",
                        right: "Verifiable on-chain RNG",
                      },
                      {
                        left: "Restrictive withdrawal policies",
                        right: "Stake and earn while playing",
                      },
                      {
                        left: "Unclear bonus terms",
                        right: "Transparent bonus system",
                      },
                      {
                        left: "Centralized control of funds",
                        right: "Self-custody of assets",
                      },
                    ].map((row, idx) => (
                      <React.Fragment key={row.left}>
                        {/* horizontal separator */}
                        <div className="col-span-2 h-px bg-cyan-400/40 shadow-[0_0_14px_rgba(34,211,238,0.65)]" />

                        {/* left cell */}
                        <div className="px-6 py-3.5 md:px-8 md:py-4 flex items-center gap-3 bg-black/40">
                          <span className="text-red-400 text-base leading-none">✕</span>
                          <span className="text-white/85">{row.left}</span>
                        </div>

                        {/* right cell */}
                        <div className="px-6 py-3.5 md:px-8 md:py-4 flex items-center gap-3 bg-black/20">
                          <span className="text-cyan-300 text-base leading-none">✓</span>
                          <span className="text-cyan-100">{row.right}</span>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <p className="relative z-10 mt-6 text-sm md:text-base text-white/80 max-w-xl">
                OneArcade leverages One Chain Network Blockchain to provide a transparent, provably fair
                gaming experience with DeFi integration.
              </p>
            </div>
          </div>
        </div>

        {/* Feature cards with improved design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0.6, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent shadow-[0_0_30px_rgba(30,123,255,0.22)] hover:shadow-[0_0_30px_rgba(0,163,255,0.6),0_0_30px_rgba(0,163,255,0.3)] transition-all duration-300 cursor-pointer"
              onClick={() => setActiveFeature(index)}
            >
              <div className={`relative bg-[#0A0F17] rounded-2xl border border-sky-400/25 overflow-hidden p-6 h-full flex flex-col ${activeFeature === index ? 'border-l-2 border-[#00A3FF]' : ''
                }`}>
                {/* inner glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]"></div>
                
                <div className="mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    activeFeature === index 
                      ? 'bg-[#00A3FF] shadow-[0_0_15px_rgba(0,163,255,0.5)]' 
                      : 'bg-[#0B1324] border border-sky-400/20'
                  }`}>
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-white font-medium text-lg mb-2 relative z-10">{feature.title}</h3>
                <p className="text-white/70 text-sm relative z-10">{feature.description}</p>

                <div className="mt-auto pt-4 relative z-10">
                  <div className="h-1 w-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
