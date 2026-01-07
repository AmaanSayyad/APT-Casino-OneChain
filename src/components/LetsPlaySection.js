import { useState, useEffect } from "react";
import LaunchGameButton from "./LaunchGameButton";
import EthereumConnectWalletButton from "./EthereumConnectWalletButton";
import { FaUsers, FaTrophy, FaCoins } from "react-icons/fa";

export default function LetsPlaySection() {
  // Stats with animation
  const [stats, setStats] = useState([
    { icon: <FaUsers className="text-sky-400" />, value: 0, target: 12000, label: "Players" },
    { icon: <FaTrophy className="text-blue-500" />, value: 0, target: 25000, label: "Winners" },
    { icon: <FaCoins className="text-yellow-400" />, value: 0, target: 1000000, label: "OCT Wagered" }
  ]);
  
  // Animate stats when component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: stat.value >= stat.target ? stat.target : stat.value + Math.ceil(stat.target / 100)
        }))
      );
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="letsplay" className="relative py-24 md:py-32 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 bg-hotline overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-sky-400/30 to-blue-500/30"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-sky-400/20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-blue-500/20 animate-pulse" style={{animationDelay: "1s"}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="font-display flex text-white flex-col text-center items-center gap-6 md:gap-8">
          {/* Main heading with gradient text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
            APT-Casino
          </h1>
          
          {/* Description with improved readability */}
          <h2 className="text-white/90 text-base sm:text-lg max-w-3xl leading-relaxed">
            Join us in the realm of gaming where every click opens up a world of adventure 
            and discovery. APT-Casino isn&apos;t just a destination; it&apos;s a gateway to boundless 
            entertainment with provably fair games and exciting rewards.
          </h2>
          
          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl my-8 bg-[#0A0F17]/80 p-6 rounded-xl backdrop-blur-sm border border-sky-400/25">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-2 text-2xl">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  {stat.value.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Action buttons with improved layout */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4">
            <EthereumConnectWalletButton />
            <LaunchGameButton />
          </div>
          
          {/* Additional trust badge */}
          <div className="mt-8 bg-white/5 px-6 py-3 rounded-full text-sm text-white/80 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            Provably Fair Games • Secure Transactions • Instant Withdrawals
          </div>
        </div>
      </div>
    </section>
  );
}