"use client";
import React, { useState, useEffect } from 'react';

const AssetRow = ({ asset, onDeposit, onWithdraw, depositData, isConnected }) => {
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  
  // Format percentage
  const formatPercent = (percent) => {
    return typeof percent === 'string' && percent.includes('%') 
      ? percent 
      : `${parseFloat(percent || 0).toFixed(2)}%`;
  };
  
  const handleDeposit = () => {
    if (depositAmount && parseFloat(depositAmount) > 0) {
      onDeposit(asset, depositAmount);
      setDepositAmount('');
      setIsDepositModalOpen(false);
    }
  };
  
  const handleWithdraw = () => {
    onWithdraw(asset, depositData?.amount || 0);
    setIsWithdrawModalOpen(false);
  };
  
  return (
    <tr className="border-b border-sky-400/10 hover:bg-[#0B1324]/50 transition-colors">
      <td className="py-5 px-4">
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white"
            style={{ backgroundColor: asset.iconColor }}
          >
            <span className="text-xs font-bold">{asset.symbol.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{asset.symbol}</p>
            <p className="text-xs text-white/50">{asset.name}</p>
          </div>
        </div>
      </td>
      <td className="py-5 px-4">
        <span className="font-medium">
          {formatPercent(asset.apy || asset.apr)}
        </span>
      </td>
      <td className="py-5 px-4">
        <span className="font-medium">
          {depositData ? depositData.amount : '0'}
        </span>
      </td>
      <td className="py-5 px-4">
        <div className="flex gap-2 justify-end">
          <button 
            onClick={() => setIsWithdrawModalOpen(true)}
            disabled={!isConnected || !depositData || parseFloat(depositData?.amount || 0) <= 0}
            className="px-4 py-2 border border-red-500/50 text-white font-medium rounded-[30px] hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
          >
            Withdraw
          </button>
          <button 
            onClick={() => setIsDepositModalOpen(true)}
            disabled={!isConnected}
            className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white font-medium px-4 py-2 rounded-[30px] hover:from-[#0066FF] hover:to-[#00A3FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.8),0_0_40px_rgba(0,163,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Deposit
          </button>
        </div>
        
        {/* Deposit Modal */}
        {isDepositModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent shadow-[0_0_30px_rgba(30,123,255,0.22)] max-w-md w-full">
              <div className="relative bg-[#0A0F17] rounded-2xl border border-sky-400/25 overflow-hidden p-6">
                {/* inner glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]"></div>
                
                <h3 className="text-xl font-medium mb-4 relative z-10">Deposit {asset.symbol}</h3>
                <div className="mb-4 relative z-10">
                  <label className="block text-sm text-white/70 mb-2">Amount to Deposit</label>
                  <div className="relative rounded-md p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent">
                    <div className="flex bg-[#0B1324] border border-sky-400/20 rounded-md overflow-hidden">
                      <input
                        type="text"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="bg-transparent flex-1 p-3 focus:outline-none text-white"
                      />
                      <button className="bg-[#0A0F17] border-l border-sky-400/20 px-4 text-sm font-medium text-[#00A3FF] hover:bg-[#0B1324] transition-colors">MAX</button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 justify-end mt-6 relative z-10">
                  <button 
                    onClick={() => setIsDepositModalOpen(false)}
                    className="px-4 py-2 border border-red-500/50 text-white font-medium rounded-[30px] hover:bg-red-500/10 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeposit}
                    className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white font-medium px-4 py-2 rounded-[30px] hover:from-[#0066FF] hover:to-[#00A3FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.8),0_0_40px_rgba(0,163,255,0.4)] transition-all text-sm"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Withdraw Modal */}
        {isWithdrawModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent shadow-[0_0_30px_rgba(30,123,255,0.22)] max-w-md w-full">
              <div className="relative bg-[#0A0F17] rounded-2xl border border-sky-400/25 overflow-hidden p-6">
                {/* inner glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]"></div>
                
                <h3 className="text-xl font-medium mb-4 relative z-10">Withdraw {asset.symbol}</h3>
                <div className="mb-4 relative z-10">
                  <p className="text-white/70 mb-2">
                    Available to withdraw: <span className="font-medium">{depositData?.amount || 0} {asset.symbol}</span>
                  </p>
                  <p className="text-sm text-white/50 mb-4">
                    Withdrawing will reduce your position and stop earning APY on this amount.
                  </p>
                </div>
                <div className="flex gap-3 justify-end mt-6 relative z-10">
                  <button 
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2 border border-red-500/50 text-white font-medium rounded-[30px] hover:bg-red-500/10 transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleWithdraw}
                    className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white font-medium px-4 py-2 rounded-[30px] hover:from-[#0066FF] hover:to-[#00A3FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.8),0_0_40px_rgba(0,163,255,0.4)] transition-all text-sm"
                  >
                    Withdraw All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

const LendingTable = ({ assets = [], isLoading = false }) => {
  const [isClient, setIsClient] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userDeposits, setUserDeposits] = useState({});
  const [isPending, setIsPending] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';
  
  useEffect(() => {
    setIsClient(true);
    
    // In development mode, mock connected state and deposits
    if (isDev) {
      setIsConnected(true);
      // Create mock deposits for demo assets
      const mockDeposits = {};
      assets.forEach(asset => {
        mockDeposits[asset.symbol] = {
          amount: (Math.random() * 100).toFixed(2),
          value: (Math.random() * 1000).toFixed(2)
        };
      });
      setUserDeposits(mockDeposits);
      return;
    }
    
    // Load connection state for Ethereum
    const loadConnectionState = async () => {
      try {
        // Set connected state for Ethereum testnet
        setIsConnected(true);
        
        // Try to load user deposits
        try {
          const { default: useLendingMarket } = await import('../hooks/useLendingMarket');
          const { userDeposits } = useLendingMarket();
          if (userDeposits) {
            setUserDeposits(userDeposits);
          }
        } catch (err) {
          console.warn("Failed to load user deposits:", err);
        }
      } catch (err) {
        console.warn("Failed to load wallet connection state:", err);
      }
    };
    
    loadConnectionState();
  }, [isDev, assets]);
  
  const handleDeposit = async (asset, amount) => {
    if (!isConnected) {
      // Show Ethereum wallet connection message
      if (!isDev) {
        alert("Please connect your Ethereum wallet to continue");
      }
      return;
    }
    
    try {
      setIsPending(true);
      
      // In development mode, just simulate a deposit
      if (isDev) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
        
        // Update the mock deposit
        setUserDeposits(prev => ({
          ...prev,
          [asset.symbol]: {
            amount: parseFloat(prev[asset.symbol]?.amount || 0) + parseFloat(amount),
            value: parseFloat(prev[asset.symbol]?.value || 0) + parseFloat(amount) * 10
          }
        }));
        
        alert(`Successfully deposited ${amount} ${asset.symbol}`);
      } else {
        // In production, use the actual deposit function
        try {
          const { default: useLendingMarket } = await import('../hooks/useLendingMarket');
          const { depositAsset } = useLendingMarket();
          await depositAsset(asset, amount);
          alert(`Successfully deposited ${amount} ${asset.symbol}`);
        } catch (err) {
          console.error('Deposit failed:', err);
          alert(`Deposit failed: ${err.message}`);
        }
      }
    } finally {
      setIsPending(false);
    }
  };
  
  const handleWithdraw = async (asset, amount) => {
    if (!isConnected) {
      // Show Ethereum wallet connection message
      if (!isDev) {
        alert("Please connect your Ethereum wallet to continue");
      }
      return;
    }
    
    try {
      setIsPending(true);
      
      // In development mode, just simulate a withdrawal
      if (isDev) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Fake delay
        
        // Update the mock deposit
        setUserDeposits(prev => ({
          ...prev,
          [asset.symbol]: {
            amount: 0,
            value: 0
          }
        }));
        
        alert(`Successfully withdrawn ${amount} ${asset.symbol}`);
      } else {
        // In production, use the actual withdraw function
        try {
          const { default: useLendingMarket } = await import('../hooks/useLendingMarket');
          const { withdrawAsset } = useLendingMarket();
          await withdrawAsset(asset, amount);
          alert(`Successfully withdrawn ${amount} ${asset.symbol}`);
        } catch (err) {
          console.error('Withdrawal failed:', err);
          alert(`Withdrawal failed: ${err.message}`);
        }
      }
    } finally {
      setIsPending(false);
    }
  };
  
  // Loading state
  if (isLoading || !isClient) {
    return (
      <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent shadow-[0_0_30px_rgba(30,123,255,0.22)] overflow-hidden">
        <div className="relative bg-[#0A0F17] rounded-2xl border border-sky-400/25 overflow-hidden p-6 overflow-x-auto">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]"></div>
          <div className="flex justify-center py-8 relative z-10">
            <div className="animate-spin w-8 h-8 border-4 border-white/20 rounded-full border-t-[#00A3FF]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent shadow-[0_0_30px_rgba(30,123,255,0.22)] overflow-hidden">
      <div className="relative bg-[#0A0F17] rounded-2xl border border-sky-400/25 overflow-hidden p-4 overflow-x-auto">
        {/* inner glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]"></div>
        
        <div className="relative z-10">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-sky-400/20">
              <th className="text-left py-4 px-4 font-display text-sm text-white/70">ASSET</th>
              <th className="text-left py-4 px-4 font-display text-sm text-white/70">APY</th>
              <th className="text-left py-4 px-4 font-display text-sm text-white/70">YOUR DEPOSIT</th>
              <th className="text-right py-4 px-4 font-display text-sm text-white/70">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <AssetRow 
                key={index} 
                asset={asset} 
                onDeposit={handleDeposit} 
                onWithdraw={handleWithdraw}
                depositData={userDeposits[asset.symbol]}
                isConnected={isConnected}
              />
            ))}
            
            {/* Empty state */}
            {assets.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-white/50">
                  No assets available for the current network
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        {/* Connection prompt */}
        {!isConnected && !isDev && (
          <div className="mt-4 p-4 bg-[#0B1324] border border-sky-400/20 rounded-lg relative z-10">
            <p className="text-center text-white/70 mb-2">Connect your wallet to see your deposits and start earning</p>
            <div className="flex justify-center">
              <button 
                onClick={() => {
                  // Show Ethereum wallet connection message
                  alert("Please connect your Ethereum wallet to continue");
                }}
                className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white font-medium px-6 py-2 rounded-[30px] hover:from-[#0066FF] hover:to-[#00A3FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.8),0_0_40px_rgba(0,163,255,0.4)] transition-all"
              >
                Connect Ethereum Wallet
              </button>
            </div>
          </div>
        )}
        
        {isDev && (
          <div className="mt-4 p-4 bg-[#0B1324] border border-yellow-600/30 rounded-lg relative z-10">
            <p className="text-center text-white/70">
              <span className="bg-yellow-600/80 text-white text-xs px-2 py-1 rounded-md mr-2">
                Dev Mode
              </span>
              Using simulated assets and deposits for development
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default LendingTable; 