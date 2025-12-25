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
      <div className="absolute -top-40 left-20 w-80 h-80 rounded-full bg-red-magic/5 blur-[120px] z-0"></div>
      <div className="absolute bottom-0 right-10 w-80 h-80 rounded-full bg-blue-magic/5 blur-[120px] z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center mb-12 justify-center">
          <div className="w-1 h-6 bg-gradient-to-r from-red-magic to-blue-magic rounded-full mr-3"></div>
          <h2 className="text-2xl font-display font-bold text-white">Key Features of APT-Casino</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Casino Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md h-[350px] rounded-xl overflow-hidden bg-gradient-to-br from-purple-800 to-blue-900">
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

          {/* Comparison section */}
          <div className="lg:col-span-7">
            {/* Outer background (dark + subtle tech glow) */}
            <div className="relative overflow-hidden rounded-2xl bg-[#0B0F16] px-5 py-8 md:px-10 md:py-10">
              {/* soft vignette + cyan glow */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,209,255,0.18)_0%,rgba(0,209,255,0.00)_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_55%)]" />
                <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(0,209,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,209,255,0.08)_1px,transparent_1px)] [background-size:64px_64px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/55" />
              </div>

              {/* Title */}
              <div className="relative z-10 text-center">
                <h2 className="text-white text-[30px] md:text-[36px] font-extrabold uppercase tracking-wider">
                  TRADITIONAL VS ONEARCADE
                </h2>
                <h4 className="mt-1 text-white/85 text-xl md:text-2xl font-semibold">
                  A New Era of Fair Gaming
                </h4>
              </div>

              {/* HUD Table Frame */}
              <div className="relative z-10 mx-auto mt-7 max-w-4xl">
                {/* frame glow */}
                <div className="absolute -inset-[10px] rounded-[22px] bg-[radial-gradient(circle,rgba(0,209,255,0.22)_0%,rgba(0,209,255,0)_62%)] blur-[2px]" />

                <div className="relative rounded-[22px] border border-[#00A3FF] bg-[#0B1220]/55 shadow-[0_0_26px_rgba(0,209,255,0.22)]">
                  {/* Corner accents (HUD brackets) */}
                  <span className="pointer-events-none absolute -left-[2px] -top-[2px] h-8 w-12 rounded-tl-[22px] border-l-2 border-t-2 border-[#00A3FF]" />
                  <span className="pointer-events-none absolute -right-[2px] -top-[2px] h-8 w-12 rounded-tr-[22px] border-r-2 border-t-2 border-[#00A3FF]" />
                  <span className="pointer-events-none absolute -left-[2px] -bottom-[2px] h-8 w-12 rounded-bl-[22px] border-l-2 border-b-2 border-[#00A3FF]" />
                  <span className="pointer-events-none absolute -right-[2px] -bottom-[2px] h-8 w-12 rounded-br-[22px] border-r-2 border-b-2 border-[#00A3FF]" />

                  {/* Table */}
                  <div className="grid grid-cols-2">
                    {/* Header row */}
                    <div className="col-span-2 grid grid-cols-2">
                      <div className="px-6 py-5 md:px-8 md:py-6 bg-[#6f6f6f] text-[22px] md:text-[26px] font-semibold text-white/45 rounded-tl-[20px]">
                        Traditional Casinos
                      </div>
                      <div className="px-6 py-5 md:px-8 md:py-6 bg-black/25 text-[22px] md:text-[26px] font-semibold text-[#00A3FF]">
                        OneArcade
                      </div>
                    </div>

                    {/* Divider line (vertical center) */}
                    <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-cyan-300/55 shadow-[0_0_18px_rgba(0,209,255,0.45)]" />

                    {/* Rows wrapper (so we can glow the horizontal lines) */}
                    <div className="col-span-2">
                      {[
                        {
                          left: "Hidden RNG algorithms",
                          right: "Verifiable on-chain randomness",
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
                      ].map((r, i) => (
                        <div
                          key={i}
                          className="relative grid grid-cols-2"
                        >
                          {/* horizontal separator */}
                          <div className="pointer-events-none absolute left-0 top-0 h-[1px] w-full bg-cyan-300/45 shadow-[0_0_14px_rgba(0,209,255,0.35)]" />

                          <div className="px-6 py-4 md:px-8 md:py-5">
                            <div className="flex items-center gap-3">
                              <span className="text-red-magic text-lg leading-none">✕</span>
                              <span className="text-[15px] md:text-[16px] text-red-magic">
                                {r.left}
                              </span>
                            </div>
                          </div>

                          <div className="px-6 py-4 md:px-8 md:py-5 text-[#00A3FF]">
                            <div className="flex items-center gap-3">
                              <span className="text-[#00A3FF] text-lg leading-none">✓</span>
                              <span className="text-[15px] md:text-[16px]">
                                {r.right}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* bottom border line */}
                      <div className="pointer-events-none h-[1px] w-full bg-cyan-300/45 shadow-[0_0_14px_rgba(0,209,255,0.35)]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer note */}
              <p className="relative z-10 mx-auto mt-6 max-w-3xl text-center text-white/80 text-sm md:text-base">
                OneArcade leverages One Chain Network Blockchain to provide a transparent, provably fair gaming
                experience with DeFi integration.
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
              className="p-[1px] bg-gradient-to-r from-red-magic/80 to-blue-magic/80 rounded-xl cursor-pointer hover:from-red-magic hover:to-blue-magic transition-all"
              onClick={() => setActiveFeature(index)}
            >
              <div className={`bg-[#1A0015] rounded-xl p-6 h-full flex flex-col ${activeFeature === index ? 'border-l-2 border-red-magic' : ''
                }`}>
                <div className="mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-magic/30 to-blue-magic/30 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                </div>

                <h3 className="text-white font-medium text-lg mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>

                <div className="mt-auto pt-4">
                  <div className="h-1 w-12 magic-gradient rounded-full"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
