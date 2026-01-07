import HeaderText from "@/components/HeaderText";
import GameCarousel from "@/components/GameCarousel";
import MostPlayed from "@/components/MostPlayed";
import GameStats from "@/components/GameStats";
import GameCarouselNew from "@/components/GameCarouselNew";

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-12 md:pb-16">
        
        {/* Featured Games Section */}
        <div className="mb-12 md:mb-16">
          <GameCarouselNew />
        </div>
        
        {/* All Games Section */}
        <MostPlayed />
      </div>
    </div>
  );
}
