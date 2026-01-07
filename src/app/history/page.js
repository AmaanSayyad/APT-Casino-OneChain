"use client";
import React from 'react';
import { useAccount } from 'wagmi';
import GameHistoryList from '@/components/GameHistory/GameHistoryList';

/**
 * Game History Page
 * Shows user's complete gaming history with VRF verification
 */
const HistoryPage = () => {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-sharp-black text-white">
      {/* Header */}
      <div className="bg-sharp-black/90 shadow-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Game History
              </h1>
              <p className="text-white/70 mt-1">
                View your complete gaming history with blockchain verification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="text-center py-12">
            <div className="bg-[#0B0F16] rounded-lg shadow-sm border border-white/10 p-8 max-w-md mx-auto">
              <span className="text-6xl mb-4 block">🔗</span>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-white/70 mb-6">
                Connect your wallet to view your gaming history and VRF transaction details.
              </p>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-red-magic to-blue-magic text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                Connect Wallet
              </button>
            </div>
          </div>
        ) : (
          <GameHistoryList userAddress={address} />
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-sharp-black/90 border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-3">
                🔒 Provably Fair Gaming
              </h3>
              <p className="text-white/70 text-sm">
                Every game result is generated using Pyth Entropy, ensuring 
                complete transparency and fairness. All results are verifiable 
                on the blockchain.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3">
                🔍 Transaction Verification
              </h3>
              <p className="text-white/70 text-sm">
                Click on any transaction hash to view the VRF request on Etherscan. 
                This allows you to independently verify that the randomness was 
                generated fairly.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-3">
                📊 Complete History
              </h3>
              <p className="text-white/70 text-sm">
                Your complete gaming history is stored securely and can be 
                exported at any time. All data includes VRF details for 
                full transparency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
