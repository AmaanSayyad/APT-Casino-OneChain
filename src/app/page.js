'use client';

import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import GameCarousel from "@/components/GameCarousel";
import LetsPlaySection from "@/components/LetsPlaySection";
import LiveStatsSection from "@/components/LiveStatsSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import UpcomingTournaments from "@/components/UpcomingTournaments";
import NewsUpdates from "@/components/NewsUpdates";
import ProvablyFairSection from "@/components/ProvablyFairSection";
import GameCarouselNew from "@/components/GameCarouselNew";

export default function Home() {
  return (
    <div className="bg-black overflow-x-hidden w-full">
      <HeroSection />
      <FeatureSection />
      {/* <GameCarousel /> */}
      <GameCarouselNew />
      <HowItWorksSection />
      <UpcomingTournaments />
      <TestimonialsSection />
      <NewsUpdates />
      <ProvablyFairSection />
      <LetsPlaySection />
    </div>
  );
}
