import HeaderText from "@/components/HeaderText";
import GameCarousel from "@/components/GameCarousel";
import MostPlayed from "@/components/MostPlayed";
import GameStats from "@/components/GameStats";
import GameCarouselNew from "@/components/GameCarouselNew";

export default function Page() {
  return (
    <div className="min-h-screen bg-sharp-black text-white">
      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-16">
        
        <div className="mb-10">
          
          {/* <GameCarousel /> */}
          <GameCarouselNew />
        </div>
        
        <MostPlayed />
      </div>
    </div>
  );
}
