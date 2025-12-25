"use client";

import { useState, useRef, useEffect } from "react";
import GradientBorderButton from "@/components/GradientBorderButton";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaUsers,
  FaStar,
  FaBolt,
  FaFire,
  FaTrophy,
} from "react-icons/fa6";
import GameStats from "@/components/GameStats";


// Game data
const FEATURED_GAMES = [
  {
    id: "roulette",
    title: "Roulette",
    description: "Spin the wheel and test your luck",
    image: "/images/games/roulette.png",
    path: "/game/roulette",
    players: 142,
    categories: ["featured", "table"],
    badge: "POPULAR",
    isNew: false,
    isHot: true,
  },
  {
    id: "mines",
    title: "Mines",
    description: "Navigate through the minefield and collect gems",
    image: "/images/games/mines.png",
    path: "/game/mines",
    players: 156,
    categories: ["featured", "instant"],
    badge: "HOT",
    isNew: false,
    isHot: true,
  },
  {
    id: "wheel",
    title: "Spin Wheel",
    description: "Spin the wheel of fortune for amazing prizes",
    image: "/images/games/spin_the_wheel.png",
    path: "/game/wheel",
    players: 98,
    categories: ["featured", "instant"],
    badge: "FEATURED",
    isNew: false,
    isHot: true,
  },
  {
    id: "plinko",
    title: "Plinko",
    description: "Drop the ball and watch it bounce to big wins",
    image: "/images/games/plinko.png",
    path: "/game/plinko",
    players: 134,
    categories: ["featured", "instant"],
    badge: "POPULAR",
    isNew: false,
    isHot: true,
  },
];

// Inline stats to match screenshot #2 style (same values you’re already showing)
const INLINE_STATS = [
  { label: "Total Bets", value: "956,421" },
  { label: "Volume", value: "4.7M OCT" },
  { label: "Max Win", value: "121,750 OCT" },
];


const GameCarouselNew = () => {
  const scrollContainerRef = useRef(null);


  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleGames, setVisibleGames] = useState(FEATURED_GAMES);


  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);


  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);


  const [activeIndex, setActiveIndex] = useState(0);


  // Filter games when category changes
  useEffect(() => {
    if (activeCategory === "all") {
      setVisibleGames(FEATURED_GAMES);
    } else {
      setVisibleGames(
        FEATURED_GAMES.filter((game) => game.categories.includes(activeCategory))
      );
    }
    setActiveIndex(0);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
  }, [activeCategory]);


  // Scroll helpers
  const getCardStep = () => {
    const container = scrollContainerRef.current;
    if (!container) return 320;


    const firstCard = container.querySelector("[data-game-card='true']");
    if (!firstCard) return 320;


    const cardWidth = firstCard.getBoundingClientRect().width;
    const gap = 24; // gap-6
    return cardWidth + gap;
  };


  // Check if scroll arrows should be visible + update dots
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;


    const onScroll = () => {
      const { scrollLeft: sl, scrollWidth, clientWidth } = container;


      setShowLeftArrow(sl > 0);
      setShowRightArrow(sl < scrollWidth - clientWidth - 10);


      const step = getCardStep();
      const idx = Math.round(sl / step);
      setActiveIndex(Math.max(0, Math.min(idx, visibleGames.length - 1)));
    };


    container.addEventListener("scroll", onScroll);
    onScroll();


    return () => container.removeEventListener("scroll", onScroll);
  }, [visibleGames]);


  const handleScrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const step = getCardStep();
    scrollContainerRef.current.scrollBy({
      left: -step * 1.2,
      behavior: "smooth",
    });
  };


  const handleScrollRight = () => {
    if (!scrollContainerRef.current) return;
    const step = getCardStep();
    scrollContainerRef.current.scrollBy({
      left: step * 1.2,
      behavior: "smooth",
    });
  };


  // Mouse drag scrolling
  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };


  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };


  const handleMouseUp = () => setIsDragging(false);


  const badgeClass = (badge) => {
    // Screenshot #2 uses blue pill badges for all
    return "bg-[#00A3FF] text-white";
  };


  const GameCard = ({ game }) => {
    const Icon =
      game.id === "roulette"
        ? FaStar
        : game.id === "mines"
        ? FaFire
        : game.id === "wheel"
        ? FaTrophy
        : FaBolt;


    return (
      <div
        data-game-card="true"
        className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[320px] snap-start px-2 py-4"
      >
        <div className="transition-transform duration-300 hover:-translate-y-2">
          {/* Outer neon frame */}
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent shadow-[0_0_30px_rgba(30,123,255,0.22)] hover:shadow-[0_0_30px_rgba(0,163,255,0.6),0_0_30px_rgba(0,163,255,0.3)] transition-all duration-300">
          <div className="relative bg-[#0A0F17] rounded-2xl border border-sky-400/25 overflow-hidden">
            {/* inner glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]" />


            <div className="relative p-4">
              {/* Top badge row (NO Live chip in new UI) */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-lg px-3 py-1 text-[11px] font-semibold tracking-wide ${badgeClass(
                    game.badge
                  )}`}
                >
                  {game.badge}
                </span>
              </div>


              {/* Big top image tile */}
              <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-[#0B1324]">
                <div className="relative w-full aspect-[4/3]">
                  {/* subtle icon watermark like screenshot feel */}
                  <Icon className="absolute right-4 bottom-4 text-7xl text-sky-300/10 z-10" />


                  <Image
                    src={game.image}
                    fill
                    sizes="(max-width: 768px) 280px, 320px"
                    quality={100}
                    priority
                    alt={`${game.title} preview`}
                    className="object-cover"
                  />
                  {/* dark gloss */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 to-black/35" />
                </div>
              </div>


              {/* Title + players (NO description in new UI) */}
              <div className="mt-4 text-center">
                <h3 className="text-3xl font-display font-bold text-white leading-tight">
                  {game.title}
                </h3>


                <div className="mt-2 flex items-center justify-center gap-2 text-sm">
                  <FaUsers className="text-sky-400" />
                  <span className="text-sky-400 font-semibold">
                    {game.players}
                  </span>
                  <span className="text-white/60">players online</span>
                </div>
              </div>


              {/* Solid blue pill CTA like screenshot #2 */}
              <div className="mt-4">
                <Link href={game.path} className="block">
                  <button
                    className="w-full rounded-full py-3 font-semibold text-white bg-[#00A3FF] hover:bg-[#0088DD] transition-all shadow-[0_0_22px_rgba(0,163,255,0.25)]"
                    aria-label={`Play ${game.title}`}
                  >
                    Play Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    );
  };


  return (
    <div className="bg-sharp-black pt-12 pb-6 container mx-auto px-4 relative overflow-visible">
      {/* Tech-ish background (NO image file, pure gradients/lines) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-55"
      />

      <div className="relative z-10 mb-6 pb-4 border-b border-gray-500/50">
        <div className="text-center md:text-left md:max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#E6F2FF] mb-3">Featured Games</h2>
          <p className="text-sm md:text-base text-white/60 whitespace-nowrap">
            Experience our premium selection of games with the highest payout rates and player counts
          </p>
        </div>

        {/* Inline stats row (matches screenshot #2) */}
        <div className="mt-4 pt-4 border-t border-gray-500/50 hidden md:flex flex-wrap items-center gap-3 text-sm md:text-base">
          {INLINE_STATS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <span className="text-white/60">{s.label}:</span>
              <span className="ml-2 text-[#4DA6FF] font-semibold">{s.value}</span>
              {i !== INLINE_STATS.length - 1 && (
                <span className="mx-4 text-[#4DA6FF]">•</span>
              )}
            </div>
          ))}
        </div>

        {/* Keep GameStats import USED (mobile only) */}
        <div className="mt-6 md:hidden">
          <GameStats />
        </div>
      </div>

      {/* Carousel */}
      <div className="relative z-10 overflow-visible py-8 -my-4">
        {showLeftArrow && (
          <button
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black border border-white/15 h-10 w-10 rounded-full flex items-center justify-center"
            aria-label="Scroll left"
          >
            <FaArrowLeft className="text-white text-sm" />
          </button>
        )}


        {showRightArrow && (
          <button
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black border border-white/15 h-10 w-10 rounded-full flex items-center justify-center"
            aria-label="Scroll right"
          >
            <FaArrowRight className="text-white text-sm" />
          </button>
        )}


        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto custom-scrollbar pb-8 pl-1 snap-x"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex gap-6 mx-auto pr-6 py-4">
            {visibleGames.length > 0 ? (
              visibleGames.map((game) => <GameCard key={game.id} game={game} />)
            ) : (
              <div className="flex items-center justify-center w-full py-10">
                <p className="text-white/70 text-lg">
                  No games found in this category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View all games button (kept exactly) */}
      <div className="relative z-10 text-center mt-10">
        <Link href="/game">
          <GradientBorderButton className="px-8">
            View All Games
          </GradientBorderButton>
        </Link>
      </div>
    </div>
  );
};

export default GameCarouselNew;
