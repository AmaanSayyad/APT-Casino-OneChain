"use client";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from 'react-redux';
import { setBalance, setLoading, loadBalanceFromStorage } from '@/store/balanceSlice';
import { useOneChainWallet } from '@/hooks/useOneChainWallet';
import OneChainWalletButton from "./OneChainWalletButton";
import LiveChat from "./LiveChat";
import SmartAccountInfo from "./SmartAccountInfo";
import SmartAccountModal from "./SmartAccountModal";
import WalletDebug from "./WalletDebug";
import { Transaction } from '@mysten/sui/transactions';

import { useNotification } from './NotificationSystem';
import { TREASURY_CONFIG } from '../config/treasury';
// Enhanced UserBalanceSystem with deposit functionality
const UserBalanceSystem = {
  getBalance: async (address) => {
    // Try to get balance from localStorage first (use same key as Redux store)
    const savedBalance = localStorage.getItem('userBalance');
    if (savedBalance) {
      return savedBalance;
    }
    // Return zero balance
    return "0";
  },
  
  deposit: async (userAddress, amount, transactionHash) => {
    try {
      console.log('Processing deposit:', { userAddress, amount, transactionHash });
      
      // Call deposit API
      const response = await fetch('/api/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: userAddress,
          amount: amount,
          transactionHash: transactionHash || '0x' + Math.random().toString(16).substr(2, 64)
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Deposit failed');
      }
      
      // Don't update balance here - it's already updated in the main deposit function
      console.log('UserBalanceSystem deposit: API call successful, balance already updated');
      
      return result;
    } catch (error) {
      console.error('Deposit error:', error);
      throw error;
    }
  }
};

const parseAptAmount = (amount) => {
  // Mock parsing for demo
  return parseFloat(amount) / 100000000;
};

const ethereumClient = {
  waitForTransaction: async ({ transactionHash }) => {
    // Mock transaction wait for demo
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
};

const CASINO_MODULE_ADDRESS = process.env.NEXT_PUBLIC_CASINO_MODULE_ADDRESS || "0x0000000000000000000000000000000000000000";

// Mock search results for demo purposes
const MOCK_SEARCH_RESULTS = {
  games: [
    { id: 'game1', name: 'Roulette', path: '/game/roulette', type: 'Featured' },
    { id: 'game2', name: 'Mines', path: '/game/mines', type: 'Popular' },
    { id: 'game3', name: 'Spin Wheel', path: '/game/wheel', type: 'Featured' },
    { id: 'game4', name: 'Plinko', path: '/game/plinko', type: 'Popular' },
  ],
  tournaments: [
    { id: 'tournament1', name: 'High Roller Tournament', path: '/tournaments/high-roller', prize: '10,000 OCT' },
    { id: 'tournament2', name: 'Weekend Battle', path: '/tournaments/weekend-battle', prize: '5,000 OCT' },
  ],
  pages: [
    { id: 'page1', name: 'Bank', path: '/bank', description: 'Deposit and withdraw funds' },
    { id: 'page2', name: 'Profile', path: '/profile', description: 'Your account details' },
  ]
};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userAddress, setUserAddress] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const searchInputRef = useRef(null);
  const searchPanelRef = useRef(null);
  const notification = useNotification();
  const isDev = process.env.NODE_ENV === 'development';
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const dispatch = useDispatch();
  const { userBalance, isLoading: isLoadingBalance } = useSelector((state) => state.balance);
  const [walletNetworkName, setWalletNetworkName] = useState("");

  // User balance management
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showSmartAccountModal, setShowSmartAccountModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("0");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [isDepositing, setIsDepositing] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);


  // One Chain Wallet connection
  const { 
    isConnected, 
    address, 
    balance: walletBalance,
    formatOCTAmount,
    parseOCTAmount,
    fetchBalance,
    executeTransaction,
    suiClient
  } = useOneChainWallet();
  const isWalletReady = isConnected && address;

  // Debug wallet connection
  useEffect(() => {
    console.log('🔗 Wallet connection state:', { 
      isConnected, 
      address, 
      isWalletReady 
    });
    
    // Check if wallet is connected but address is not yet available
    if (isConnected && !address) {
      console.log('⚠️ Wallet connected but address not yet available, waiting...');
      // Add a small delay to see if address becomes available
      const timer = setTimeout(() => {
        console.log('⏰ After delay - Wallet state:', { 
          isConnected, 
          address, 
          isWalletReady 
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, isWalletReady]);


  // Mock notifications for UI purposes
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Balance Updated',
      message: 'Your OCT balance has been updated',
      isRead: false,
      time: '2 min ago'
    },
    {
      id: '2',
      title: 'New Tournament',
      message: 'High Roller Tournament starts in 1 hour',
      isRead: false,
      time: '1 hour ago'
    }
  ]);

  // Load user balance from house account
  const loadUserBalance = async () => {
    if (!address) return;
    
    try {
      dispatch(setLoading(true));
      
      // First try to get from localStorage
      const localBalance = localStorage.getItem(`userBalance_${address}`);
      console.log('Loading balance from localStorage:', localBalance);
      
      if (localBalance && parseFloat(localBalance) > 0) {
        dispatch(setBalance(localBalance));
        console.log('Balance loaded from localStorage:', localBalance);
      } else {
        // If no local balance, try to get from UserBalanceSystem
        const balance = await UserBalanceSystem.getBalance(address);
        console.log('Balance loaded from UserBalanceSystem:', balance);
        dispatch(setBalance(balance));
        
              // Save to localStorage for persistence (use same key as Redux store)
      localStorage.setItem('userBalance', balance);
      }
      
    } catch (error) {
      console.error('Error loading user balance:', error);
      dispatch(setBalance("0"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Load balance from localStorage
  const loadBalanceFromStorage = (address) => {
    if (!address) return null;
    return localStorage.getItem('userBalance');
  };

  // Load balance when wallet connects
  useEffect(() => {
    if (isWalletReady && address) {
      // First try to load from localStorage
      const savedBalance = loadBalanceFromStorage(address);
      if (savedBalance && savedBalance !== "0") {
        console.log('Loading saved balance from localStorage:', savedBalance);
        dispatch(setBalance(savedBalance));
      } else {
        // If no saved balance, load from blockchain
        loadUserBalance();
      }
      
      // Load deposit history
      
    }
  }, [isWalletReady, address]);
  
  // Auto-refresh balance every 5 seconds when wallet is connected
  useEffect(() => {
    if (!isWalletReady || !address) return;
    
    const interval = setInterval(() => {
      const localBalance = localStorage.getItem('userBalance');
      if (localBalance && localBalance !== userBalance) {
        console.log('Auto-refreshing balance:', { localBalance, userBalance });
        dispatch(setBalance(localBalance));
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isWalletReady, address, userBalance]);
  
  // Load deposit history


  // Check if wallet was previously connected on page load
  useEffect(() => {
    const checkWalletConnection = async () => {
      // Check if wallet was previously connected
      const wasConnected = localStorage.getItem('wagmi.connected');
      if (wasConnected === 'true') {
        console.log('🔄 Wallet was previously connected, restoring balance...');
        
        // Restore balance from localStorage
        const savedBalance = localStorage.getItem('userBalance');
        if (savedBalance) {
          console.log('💰 Restoring balance from localStorage:', savedBalance);
          dispatch(setBalance(parseFloat(savedBalance)));
        }
      }
    };
    
    checkWalletConnection();
  }, [dispatch]);

  useEffect(() => {
    setIsClient(true);
    setUnreadNotifications(notifications.filter(n => !n.isRead).length);
    
    // Initialize dark mode from local storage if available
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    }
    
    // Ethereum wallet integration - simplified for testnet only
    // In development mode, use mock data
    if (isDev) {
      setUserAddress('0x1234...dev');
    }
    
    // Handle click outside search panel
    const handleClickOutside = (event) => {
      if (
        searchPanelRef.current && 
        !searchPanelRef.current.contains(event.target) &&
        !searchInputRef.current?.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDev, notifications]);

  // Close balance modal with ESC
  useEffect(() => {
    if (!showBalanceModal) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setShowBalanceModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showBalanceModal]);
  
  // Poll for balance changes
  const pollForBalance = async (initialBalance, attempts = 10, interval = 2000) => {
    dispatch(setLoading(true));
    for (let i = 0; i < attempts; i++) {
      try {
        const newBalance = await UserBalanceSystem.getBalance(address);
        if (newBalance !== initialBalance) {
          dispatch(setBalance(newBalance));
          notification.success('Balance updated successfully!');
          dispatch(setLoading(false));
          return;
        }
      } catch (error) {
        console.error(`Polling attempt ${i + 1} failed:`, error);
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    notification.error('Balance update timed out. Please refresh manually.');
    dispatch(setLoading(false));
  };

  // Handle withdraw from house account (One Chain)
  const handleWithdraw = async () => {
    if (!isConnected || !address) {
      notification.error('Please connect your wallet first');
      return;
    }

    try {
      setIsWithdrawing(true);
      const balanceInOct = parseFloat(userBalance || '0');
      if (balanceInOct <= 0) {
        notification.error('No balance to withdraw');
        return;
      }

      // Call backend API to process withdrawal from One Chain treasury
      console.log('🔍 Withdrawing from One Chain treasury:', { address, amount: balanceInOct });
      
      notification.info('Processing withdrawal from treasury...');
      
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: address,
          amount: balanceInOct,
          network: 'onechain-testnet'
        })
      });

      const result = await response.json();
      console.log('🔍 Withdraw API response:', result);

      if (!response.ok) {
        const errorMessage = result?.error || 'Withdrawal failed';
        throw new Error(errorMessage);
      }

      // Update user balance to 0 after successful withdrawal
      dispatch(setBalance('0'));
      
      // Clear localStorage balance
      localStorage.setItem('userBalance', '0');
      
      // Check if transaction digest exists
      const txDigest = result?.transactionDigest || result?.transactionHash || 'Unknown';
      const txDisplay = txDigest !== 'Unknown' ? `${txDigest.slice(0, 10)}...` : 'Pending';
      
      notification.success(`Withdrawal successful! ${balanceInOct.toFixed(5)} OCT transferred. TX: ${txDisplay}`);
      
      // Close the modal
      setShowBalanceModal(false);
      
    } catch (error) {
      console.error('Withdraw error:', error);
      
      // Ensure error message is a string
      const errorMessage = error?.message || 'Unknown error occurred';
      const safeErrorMessage = typeof errorMessage === 'string' ? errorMessage : 'Unknown error occurred';
      
      notification.error(`Withdrawal failed: ${safeErrorMessage}`);
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Handle deposit to house balance (One Chain)
  const handleDeposit = async () => {
    // Prevent multiple simultaneous deposits
    if (isDepositing) {
      console.log('🚫 Deposit already in progress, ignoring duplicate call');
      return;
    }
    
    if (!isConnected || !address) {
      notification.error('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      notification.error('Please enter a valid deposit amount');
      return;
    }
    
    // Check deposit limits
    if (amount < TREASURY_CONFIG.LIMITS.MIN_DEPOSIT) {
      notification.error(`Minimum deposit amount is ${TREASURY_CONFIG.LIMITS.MIN_DEPOSIT} OCT`);
      return;
    }
    
    if (amount > TREASURY_CONFIG.LIMITS.MAX_DEPOSIT) {
      notification.error(`Maximum deposit amount is ${TREASURY_CONFIG.LIMITS.MAX_DEPOSIT} OCT`);
      return;
    }

    setIsDepositing(true);
    console.log('🚀 Starting One Chain deposit process for:', amount, 'OCT');
    try {
      // Check wallet connection
      if (!isConnected || !address) {
        throw new Error('Wallet is not connected. Please connect your wallet first.');
      }
      
      console.log('Depositing to One Chain treasury:', { address, amount });
      
      // Get user's OCT coins (One Chain uses 0x2::oct::OCT)
      const coins = await suiClient.getCoins({
        owner: address,
        coinType: '0x2::oct::OCT'
      });

      if (!coins.data || coins.data.length === 0) {
        throw new Error('No OCT coins found in your wallet. Please ensure you have OCT tokens.');
      }

      // Calculate total balance
      const totalBalance = coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);
      const amountInMist = BigInt(parseOCTAmount(amount));
      const estimatedGas = BigInt(10000000); // 0.01 OCT for gas
      const totalNeeded = amountInMist + estimatedGas;

      if (totalBalance < totalNeeded) {
        throw new Error(`Insufficient OCT balance. Available: ${Number(totalBalance) / 1e9} OCT, Needed: ${amount} OCT (+ gas)`);
      }

      // Find a coin with sufficient balance for payment
      let paymentCoin = coins.data.find(coin => BigInt(coin.balance) >= amountInMist);
      if (!paymentCoin) {
        // If no single coin has enough, use the largest one
        paymentCoin = coins.data.reduce((max, coin) => 
          BigInt(coin.balance) > BigInt(max.balance) ? coin : max
        );
      }

      // Find a separate coin for gas (different from payment coin)
      let gasCoin = coins.data.find(coin => 
        coin.coinObjectId !== paymentCoin.coinObjectId && 
        BigInt(coin.balance) >= estimatedGas
      );
      
      console.log(`💳 Using payment coin: ${paymentCoin.coinObjectId} (${paymentCoin.balance} MIST)`);
      if (gasCoin) {
        console.log(`⛽ Using separate gas coin: ${gasCoin.coinObjectId} (${gasCoin.balance} MIST)`);
      } else {
        console.log(`⛽ No separate gas coin, wallet will auto-select gas`);
      }
      
      // Create Sui transaction for OCT transfer
      const tx = new Transaction();
      
      // Only set gas payment if we have a separate gas coin
      // Otherwise, let the wallet auto-select gas from available coins
      if (gasCoin) {
        tx.setGasPayment([{
          objectId: gasCoin.coinObjectId,
          version: gasCoin.version,
          digest: gasCoin.digest
        }]);
      }
      // If no separate gas coin, don't set gas payment - wallet will handle it
      
      // Split coin for exact amount from payment coin
      const [coin] = tx.splitCoins(tx.object(paymentCoin.coinObjectId), [amountInMist.toString()]);
      
      // Transfer to treasury
      tx.transferObjects([coin], TREASURY_CONFIG.ADDRESS);
      
      // Set gas budget
      tx.setGasBudget(estimatedGas.toString());
      
      notification.info('Please approve the transaction in your wallet...');
      
      // Execute transaction
      let result;
      try {
        result = await executeTransaction(tx);
      } catch (error) {
        // Handle permission errors specifically
        if (error?.message?.includes('permission') || 
            error?.message?.includes('viewAccount') || 
            error?.message?.includes('suggestTransaction')) {
          notification.error('Wallet permission denied. Please reconnect your wallet and try again.');
          throw new Error('Wallet permission denied. Please disconnect and reconnect your wallet, then try again.');
        }
        throw error;
      }
      
      console.log('✅ Deposit transaction successful:', result);
      
      // Update local balance
      const currentBalance = parseFloat(userBalance || '0');
      const newBalance = (currentBalance + amount).toString();
      
      console.log('🔄 Balance update:', { currentBalance, amount, newBalance });
      
      // Update Redux store
      dispatch(setBalance(newBalance));
      
      // Show success with transaction digest
      const txDigest = result.digest;
      notification.success(
        `Successfully deposited ${amount} OCT! TX: ${txDigest.slice(0, 10)}...`
      );
      
      setDepositAmount("");
      
      
      
    } catch (error) {
      console.error('Deposit error:', error);
      const errorMessage = error?.message || 'Unknown error';
      
      // Provide specific guidance for permission errors
      if (errorMessage.includes('permission') || 
          errorMessage.includes('viewAccount') || 
          errorMessage.includes('suggestTransaction')) {
        notification.error(
          'Wallet permission denied. Please disconnect and reconnect your wallet, then try again.',
          { duration: 5000 }
        );
      } else {
        notification.error(`Deposit failed: ${errorMessage}`);
      }
    } finally {
      setIsDepositing(false);
    }
  };

  // Handle search input
  useEffect(() => {
    if (searchQuery.length > 1) {
      // In a real app, you would call an API here
      // For demo, we'll filter the mock data
      const query = searchQuery.toLowerCase();
      const games = MOCK_SEARCH_RESULTS.games.filter(
        game => game.name.toLowerCase().includes(query)
      );
      const tournaments = MOCK_SEARCH_RESULTS.tournaments.filter(
        tournament => tournament.name.toLowerCase().includes(query)
      );
      const pages = MOCK_SEARCH_RESULTS.pages.filter(
        page => page.name.toLowerCase().includes(query) || 
               (page.description && page.description.toLowerCase().includes(query))
      );
      
      setSearchResults({ games, tournaments, pages });
    } else {
      setSearchResults(null);
    }
  }, [searchQuery]);

  const navLinks = [
    {
      name: "Home",
      path: "/",
      classes: "text-hover-gradient-home",
    },
    {
      name: "Game",
      path: "/game",
      classes: "text-hover-gradient-game",
    },
    {
      name: "Live",
      path: "/live",
      classes: "text-hover-gradient-live",
    },
    {
      name: "Bank",
      path: "/bank",
      classes: "text-hover-gradient-bank",
    },
  ];

  const handleProfileClick = () => {
    router.push("/profile");
  };
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
    // Here you would also apply the theme change to your app
  };
  
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, isRead: true} : n)
    );
    setUnreadNotifications(prev => Math.max(0, prev - 1));
  };
  
  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true})));
    setUnreadNotifications(0);
    setShowNotificationsPanel(false);
    notification.success("All notifications marked as read");
  };
  
  const handleSearchIconClick = () => {
    setShowSearch(prev => !prev);
    if (!showSearch) {
      // Focus the search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleSearchItemClick = (path) => {
    router.push(path);
    setShowSearch(false);
    setSearchQuery('');
  };

  // Pyth Entropy handles randomness generation

  // Detect Ethereum wallet network (best-effort)
  useEffect(() => {
    const readNetwork = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum?.network) {
          const n = await window.ethereum.network();
          if (n?.name) setWalletNetworkName(String(n.name).toLowerCase());
        }
      } catch {}
    };
    readNetwork();
    const off = window?.ethereum?.onNetworkChange?.((n) => {
      try { setWalletNetworkName(String(n?.name || '').toLowerCase()); } catch {}
    });
    return () => {
      try { off && off(); } catch {}
    };
  }, []);

      // switchToTestnet function removed

  return (
    <>
      <nav className="backdrop-blur-md bg-[#070005]/90 fixed w-full z-20 transition-all duration-300 shadow-lg">
        <div className="flex w-full items-center justify-between py-6 px-4 sm:px-10 md:px-20 lg:px-36">
          <div className="flex items-center">
            <a href="/" className="logo mr-6">
            <Image
              src="/PowerPlay.png"
              alt="powerplay image"
              width={172}
              height={15}
              />
            </a>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white p-1 rounded-lg hover:bg-purple-500/20 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              aria-label="Toggle mobile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {showMobileMenu ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex font-display gap-8 lg:gap-12 items-center">
            {navLinks.map(({ name, path, classes }, index) => (
              <div key={index} className="relative group">
              <Link
                  className={`${path === pathname ? (name === "Home" ? "text-white font-semibold" : "text-transparent bg-clip-text bg-gradient-to-r from-red-magic to-blue-magic font-semibold") : (name === "Home" || name === "Game" || name === "Bank" ? "text-white" : classes)} flex items-center gap-1 text-lg font-medium transition-all duration-200 hover:scale-105`}
                href={path}
              >
                {name}
              </Link>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
          
            {/* User Balance Display */}
            {isWalletReady && (
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-green-900/20 to-green-800/10 rounded-lg border border-green-800/30 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-300">Balance:</span>
                    <span className="text-sm text-green-300 font-medium">
                      {isLoadingBalance ? 'Loading...' : `${parseFloat(userBalance || '0').toFixed(5)} OCT`}
                    </span>
                    <button
                      onClick={() => setShowBalanceModal(true)}
                      className="ml-2 text-xs bg-green-600/30 hover:bg-green-500/30 text-green-300 px-2 py-1 rounded transition-colors"
                    >
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* One Chain Wallet Button */}
            <OneChainWalletButton />
            
            {/* Live Chat Button */}
            <button
              onClick={() => setShowLiveChat(true)}
              className="px-4 py-2 border border-[#00A3FF] hover:border-[#00A3FF] hover:bg-[#00A3FF] text-[#00A3FF] hover:text-white font-medium rounded-[30px] transition-all duration-200 flex items-center gap-2 bg-transparent"
            >
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg> */}
              Live Chat
            </button>
      
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-[#0A0008]/95 backdrop-blur-md p-4 border-t border-purple-500/20 animate-slideDown">
            <div className="flex flex-col space-y-3">
              {navLinks.map(({ name, path, classes }, index) => (
                <div key={index}>
                  <Link
                    className={`${path === pathname ? (name === "Home" ? 'text-white font-semibold' : 'text-white font-semibold') : (name === "Home" || name === "Game" || name === "Bank" ? 'text-white' : 'text-white/80')} py-2 px-3 rounded-md hover:bg-purple-500/10 flex items-center w-full text-lg`}
                    href={path}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {name}
                  </Link>
                </div>
              ))}
              {/* Switch to Testnet button removed */}
              <div className="flex justify-between items-center py-2 px-3">
                <span className="text-white/70">Dark Mode</span>
                <button 
                  onClick={toggleDarkMode}
                  className="p-2 text-white/70 hover:text-white bg-purple-500/10 rounded-full flex items-center justify-center h-8 w-8"
                >
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="4"></circle>
                      <path d="M12 2v2"></path>
                      <path d="M12 20v2"></path>
                      <path d="M5 5l1.5 1.5"></path>
                      <path d="M17.5 17.5l1.5 1.5"></path>
                      <path d="M2 12h2"></path>
                      <path d="M20 12h2"></path>
                      <path d="M5 19l1.5-1.5"></path>
                      <path d="M17.5 6.5l1.5-1.5"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  )}
                </button>
              </div>
              
              {/* User Balance in Mobile Menu */}
              {isWalletReady && (
                <div className="pt-2 mt-2 border-t border-purple-500/10">
                  <div className="p-3 bg-gradient-to-r from-green-900/20 to-green-800/10 rounded-lg border border-green-800/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">House Balance:</span>
                      <span className="text-sm text-green-300 font-medium">
                      {isLoadingBalance ? 'Loading...' : `${parseFloat(userBalance || '0').toFixed(5)} OCT`}
                    </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowBalanceModal(true);
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-xs bg-green-600/30 hover:bg-green-500/30 text-green-300 px-3 py-2 rounded transition-colors"
                    >
                      Manage Balance
                    </button>
                  </div>
                </div>
              )}
              
              <div className="pt-2 mt-2 border-t border-purple-500/10">
                <a 
                  href="#support" 
                  className="block py-2 px-3 text-white/80 hover:text-white hover:bg-purple-500/10 rounded-md"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Balance Management Modal (portal) */}
        {isClient && showBalanceModal && createPortal(
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowBalanceModal(false)}
          >
            <div
              className="bg-[#0A0008] border border-purple-500/20 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">House Balance</h3>
                <button
                  onClick={() => setShowBalanceModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Current Balance */}
              {/* Smart Account Info */}
              <SmartAccountInfo />
              
              <div className="mb-4 p-3 bg-gradient-to-r from-green-900/20 to-green-800/10 rounded-lg border border-green-800/30">
                <span className="text-sm text-gray-300">Current Balance:</span>
                <div className="text-lg text-green-300 font-bold">
                  {isLoadingBalance ? 'Loading...' : `${parseFloat(userBalance || '0').toFixed(5)} OCT`}
                </div>
              </div>
              
              {/* Deposit Section */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-white mb-2">Deposit OCT to Casino Treasury</h4>
                <div className="text-xs text-gray-400 mb-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Network:</span>
                    <span className="text-purple-400 font-medium">{TREASURY_CONFIG.NETWORK.CHAIN_NAME}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Treasury:</span>
                    <span className="font-mono">{TREASURY_CONFIG.ADDRESS.slice(0, 10)}...{TREASURY_CONFIG.ADDRESS.slice(-8)}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(TREASURY_CONFIG.ADDRESS);
                        notification.success('Treasury address copied!');
                      }}
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                      title="Copy address"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter OCT amount"
                    className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25"
                    min="0"
                    step="0.00000001"
                    disabled={isDepositing}
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={!isConnected || !depositAmount || parseFloat(depositAmount) <= 0 || isDepositing}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded font-medium transition-colors flex items-center gap-2"
                  >
                    {isDepositing ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></div>
                        Depositing...
                      </>
                    ) : (
                      <>
                        Deposit
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8l-8-8-8 8" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Transfer OCT from your wallet to house balance for gaming
                </p>
                {/* Quick Deposit Buttons */}
                <div className="flex gap-1 mt-2">
                  {[0.001, 0.01, 0.1, 1].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDepositAmount(amount.toString())}
                      className="flex-1 px-2 py-1 text-xs bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded transition-colors"
                      disabled={isDepositing}
                    >
                      {amount} OCT
                    </button>
                  ))}
                </div>
                
              </div>

              {/* Withdraw Section */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Withdraw OCT</h4>
                <button
                  onClick={handleWithdraw}
                  disabled={!isConnected || parseFloat(userBalance || '0') <= 0 || isWithdrawing}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {isWithdrawing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></div>
                      Processing...
                    </>
                  ) : isConnected ? (
                    parseFloat(userBalance || '0') > 0 ? 'Withdraw All OCT' : 'No Balance'
                  ) : 'Connect Wallet'}
                  {isConnected && parseFloat(userBalance || '0') > 0 && !isWithdrawing && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
                {isConnected && parseFloat(userBalance || '0') > 0 && (
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    Withdraw {parseFloat(userBalance || '0').toFixed(5)} OCT to your wallet
                  </p>
                )}
              </div>
              
              {/* Refresh Balance */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    // Only refresh from localStorage, don't try blockchain
                    const savedBalance = loadBalanceFromStorage(address);
                    if (savedBalance && savedBalance !== "0") {
                      console.log('Refreshing balance from localStorage:', savedBalance);
                      dispatch(setBalance(savedBalance));
                    } else {
                      console.log('No saved balance in localStorage');
                    }
                  }}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors"
                >
                  Refresh Balance
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
        
        <div className="w-full h-[2px] magic-gradient overflow-hidden"></div>
      </nav>
      
      {/* Pyth Entropy handles randomness generation */}
      
      {/* Live Chat Modal */}
      <LiveChat
        open={showLiveChat}
        onClose={() => setShowLiveChat(false)}
      />
      
      {/* Smart Account Modal */}
      <SmartAccountModal
        isOpen={showSmartAccountModal}
        onClose={() => setShowSmartAccountModal(false)}
      />
      
    </>
  );
}