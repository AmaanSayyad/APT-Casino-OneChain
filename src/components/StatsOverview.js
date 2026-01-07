"use client";
import React from 'react';
import useTokenStats from '../hooks/useTokenStats';

const StatsOverview = () => {
  const stats = useTokenStats();
  
  // Format number with commas
  const formatNumber = (num) => {
    if (num === null) return '----';
    return new Intl.NumberFormat('en-US').format(num);
  };
  
  // Format price with $ sign and 2 decimal places
  const formatPrice = (price) => {
    if (price === null) return '$--.-';
    return `$${parseFloat(price).toFixed(2)}`;
  };
  
  // Format percentage
  const formatPercent = (percent) => {
    if (percent === null) return '--.-%';
    return `${percent}%`;
  };
  
  return (
    <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent shadow-[0_0_30px_rgba(30,123,255,0.22)] mb-10">
      <div className="relative bg-[#0A0F17] rounded-2xl border border-sky-400/25 overflow-hidden p-6">
        {/* inner glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 relative z-10">
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 mr-2"></div>
              <h3 className="text-white/70 font-display text-sm uppercase tracking-wider">Platform Statistics</h3>
            </div>
            <p className="text-white/50 text-sm">Real-time overview of the OneArcade ecosystem</p>
          </div>
          
          <div className="flex flex-wrap gap-8 justify-center md:justify-end">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                {stats.loading ? (
                  <div className="h-6 w-20 bg-white/10 animate-pulse rounded"></div>
                ) : (
                  <span className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                    {formatNumber(stats.totalOGPool)}
                  </span>
                )}
              </div>
              <p className="text-xs uppercase mt-1 text-white/70">Total OCT Pool</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                {stats.loading ? (
                  <div className="h-6 w-16 bg-white/10 animate-pulse rounded"></div>
                ) : (
                  <span className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                    {formatPercent(stats.ogAPY)}
                  </span>
                )}
              </div>
              <p className="text-xs uppercase mt-1 text-white/70">OCT APY</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                {stats.loading ? (
                  <div className="h-6 w-16 bg-white/10 animate-pulse rounded"></div>
                ) : (
                  <span className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
                    {formatPrice(stats.ogPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs uppercase mt-1 text-white/70">OCT Price</p>
            </div>
            
            <div className="flex flex-col items-center">
              <button className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white font-medium px-6 py-2 rounded-[30px] hover:from-[#0066FF] hover:to-[#00A3FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.8),0_0_40px_rgba(0,163,255,0.4)] transition-all">
                Lend Assets
              </button>
            </div>
          </div>
        </div>
        
        {/* Additional stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 relative z-10">
          <div className="bg-[#0B1324] border border-sky-400/20 rounded-lg p-3">
            <p className="text-xs text-white/50 mb-1">Market Cap</p>
            <div className="text-lg font-medium">
              {stats.loading ? (
                <div className="h-5 w-24 bg-white/10 animate-pulse rounded"></div>
              ) : (
                formatPrice(stats.marketCap)
              )}
            </div>
          </div>
          
          <div className="bg-[#0B1324] border border-sky-400/20 rounded-lg p-3">
            <p className="text-xs text-white/50 mb-1">24h Volume</p>
            <div className="text-lg font-medium">
              {stats.loading ? (
                <div className="h-5 w-24 bg-white/10 animate-pulse rounded"></div>
              ) : (
                formatPrice(stats.volume24h)
              )}
            </div>
          </div>
          
          <div className="bg-[#0B1324] border border-sky-400/20 rounded-lg p-3">
            <p className="text-xs text-white/50 mb-1">24h Change</p>
            <div className={`text-lg font-medium ${stats.priceChange24h && stats.priceChange24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.loading ? (
                <div className="h-5 w-16 bg-white/10 animate-pulse rounded"></div>
              ) : (
                `${stats.priceChange24h > 0 ? '+' : ''}${stats.priceChange24h}%`
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full h-0.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full relative z-10"></div>
      
        {/* Last updated timestamp */}
        {stats.lastUpdated && (
          <div className="mt-2 flex justify-end relative z-10">
            <p className="text-xs text-white/30">
              Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsOverview; 