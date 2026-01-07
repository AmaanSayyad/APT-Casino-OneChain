"use client";

import { useState, useRef, useEffect } from "react";
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
    // HOT badge is red, others are blue
    if (badge === "HOT") {
      return "bg-red-500 text-white";
    }
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


            <div className="relative p-5">
              {/* Badge - Top Left */}
              <div className="absolute top-5 left-5 z-20">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase ${badgeClass(
                    game.badge
                  )}`}
                >
                  {game.badge}
                </span>
              </div>

              {/* Game Image */}
              <div className="mt-2 rounded-xl overflow-hidden border border-white/10 bg-[#0B1324]">
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={game.image}
                    fill
                    sizes="(max-width: 768px) 280px, 320px"
                    quality={100}
                    priority
                    alt={`${game.title} preview`}
                    className="object-cover"
                  />
                  {/* Subtle overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                </div>
              </div>

              {/* Title */}
              <div className="mt-5">
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
                  {game.title}
                </h3>
              </div>

              {/* Players Online */}
              <div className="mt-3 flex items-center justify-center gap-2">
                <FaUsers className="text-sky-400 text-sm" />
                <span className="text-white font-medium">
                  {game.players}
                </span>
                <span className="text-white/60 text-sm">players online</span>
              </div>

              {/* Play Now Button */}
              <div className="mt-5">
                <Link href={game.path} className="block group">
                  <button
                    className="w-full rounded-full py-4 font-bold text-white bg-gradient-to-r from-[#00A3FF] via-[#0066FF] to-[#00A3FF] bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-300 shadow-[0_0_25px_rgba(0,163,255,0.4)] hover:shadow-[0_0_35px_rgba(0,163,255,0.6),0_0_50px_rgba(0,163,255,0.3)] transform hover:scale-[1.03] active:scale-[0.98] relative overflow-hidden"
                    aria-label={`Play ${game.title}`}
                  >
                    {/* Animated shine effect */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Play Now
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
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
    <div className="bg-black pt-16 pb-12 container mx-auto px-4 relative overflow-visible">

      <div className="relative z-10 mb-8">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
            Featured Games
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            Experience our premium selection of games with the highest payout rates and player counts
          </p>
        </div>

        {/* Stats Row - Desktop Only */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-4 md:gap-6 text-base md:text-lg mb-8">
          {INLINE_STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-white/70 font-medium">{s.label}:</span>
              <span className="text-sky-400 font-bold">{s.value}</span>
              {i !== INLINE_STATS.length - 1 && (
                <span className="mx-2 text-sky-400/50 text-xl">•</span>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Stats - Mobile Only */}
        <div className="md:hidden mb-8">
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

      {/* View all games button */}
      <div className="relative z-10 text-center mt-10">
        <Link href="/game">
          <button className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white font-medium px-8 py-2 rounded-[30px] hover:from-[#0066FF] hover:to-[#00A3FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.8),0_0_40px_rgba(0,163,255,0.4)] transition-all">
            View All Games
          </button>
        </Link>
      </div>
    </div>
  );
};

export default GameCarouselNew;
