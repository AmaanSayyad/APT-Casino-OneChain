'use client';
import { useState, useEffect } from 'react';
import EthereumConnectWalletButton from './EthereumConnectWalletButton';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  
  // Auto rotate through steps every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveStep(current => current < 4 ? current + 1 : 1);
        setTimeout(() => setAnimating(false), 300);
      }, 300);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const steps = [
    {
      id: 1,
      title: 'Connect Your Wallet',
      description: 'Link any wallet in seconds to unlock the full OneArcade experience. We support Keyless login Walets, MetaMask and all major Web3 wallets.',
      emoji: '👛'
    },
    {
      id: 2,
      title: 'Get OCT tokens',
      description: 'Power your gameplay with OCT tokens of One Chain Network.',
      emoji: '💰'
    },
    {
      id: 3,
      title: 'Start Playing',
      description: 'Dive into /games tab of provably fair games including Roulette, Plinko, Mines and Spin Wheel. Every game provides real-time stats and detailed history.',
      emoji: '🎮'
    },
    {
      id: 4,
      title: 'Earn Rewards',
      description: 'Win OCT tokens and unlock exclusive perks through our multi-tiered loyalty program. Earn cashback on losses and gain access to tournaments.',
      emoji: '🏆'
    },
  ];
  
  const handleStepChange = (stepId) => {
    if (stepId === activeStep) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveStep(stepId);
      setTimeout(() => setAnimating(false), 300);
    }, 300);
  };
  
  return (
    <section className="py-16 px-4 md:px-8 lg:px-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-blue-500/5 blur-[120px] z-0"></div>
      <div className="absolute top-20 -left-40 w-80 h-80 rounded-full bg-sky-500/5 blur-[120px] z-0"></div>
      
      {/* Floating orbs background - Hidden on mobile */}
      <div className="hidden md:block absolute top-10 right-10 w-6 h-6 rounded-full bg-sky-400/20 animate-float"></div>
      <div className="hidden md:block absolute top-40 left-1/4 w-4 h-4 rounded-full bg-blue-500/20 animate-float-delay"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-20 h-1 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full mb-5"></div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">How OneArcade Works</h2>
          <p className="text-white/70 max-w-2xl text-lg">Experience the future of decentralized gaming in four seamless steps</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Steps Navigation */}
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent shadow-[0_0_30px_rgba(30,123,255,0.22)] transition-all duration-300">
            <div className="relative bg-[#0A0F17] rounded-2xl border border-sky-400/25 overflow-hidden">
              {/* inner glow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]"></div>
              <div className="relative p-5">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  className={`mb-4 p-4 rounded-xl cursor-pointer transition-all duration-300 transform ${
                    activeStep === step.id 
                      ? 'bg-[#0B1324] border border-sky-400/30 scale-[1.02] shadow-[0_0_15px_rgba(0,163,255,0.2)]' 
                      : 'hover:bg-[#0B1324]/50 hover:scale-[1.01] border border-transparent'
                  } ${step.id < activeStep ? 'opacity-90' : 'opacity-100'}`}
                  onClick={() => handleStepChange(step.id)}
                >
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 shadow-lg transform transition-all duration-300 ${
                      activeStep === step.id 
                        ? 'bg-[#00A3FF] scale-110 shadow-[0_0_15px_rgba(0,163,255,0.5)]' 
                        : 'bg-[#0B1324] border border-sky-400/20'
                    }`}>
                      <span className="text-white text-lg">{step.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-medium text-lg transition-all duration-300 ${activeStep === step.id ? 'text-[#00A3FF]' : 'text-white'}`}>
                        {step.title}
                      </h3>
                      <p className={`mt-2 text-sm leading-relaxed ${activeStep === step.id ? 'text-white/90' : 'text-white/60'}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-6 flex justify-center lg:justify-start">
                {activeStep === 1 ? (
                  <EthereumConnectWalletButton />
                ) : (
                  <button className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white font-medium px-6 py-2 rounded-[30px] hover:from-[#0066FF] hover:to-[#00A3FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.8),0_0_40px_rgba(0,163,255,0.4)] transition-all transform hover:scale-105">
                    {activeStep === 2 ? 'Get OCT tokens' : 
                     activeStep === 3 ? 'Browse Games' : 'View Rewards'}
                  </button>
                )}
              </div>
              </div>
            </div>
          </div>
          
          {/* Illustration Area */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-xl h-[400px]">
              {/* Progress indicator */}
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    className={`w-6 h-2 rounded-full transition-all duration-300 ${
                      activeStep === step.id 
                        ? 'bg-[#00A3FF] w-10 shadow-[0_0_10px_rgba(0,163,255,0.5)]' 
                        : 'bg-white/20 hover:bg-sky-400/30'
                    }`}
                    onClick={() => handleStepChange(step.id)}
                    aria-label={`Go to step ${step.id}`}
                  />
                ))}
              </div>
              
              {/* Animated background elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 bg-gradient-to-r from-sky-400/10 to-blue-500/10 rounded-full animate-pulse"></div>
                <div className="absolute w-80 h-80 border border-sky-400/10 rounded-full animate-spin-slow"></div>
              </div>
              
              {/* Main illustration card */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-sky-400/70 via-blue-500/30 to-transparent shadow-[0_0_30px_rgba(30,123,255,0.22)] hover:shadow-[0_0_30px_rgba(0,163,255,0.6),0_0_30px_rgba(0,163,255,0.3)] transition-all duration-300">
                  <div className="relative bg-[#0A0F17] rounded-2xl border border-sky-400/25 overflow-hidden p-10 w-[380px] h-[380px] flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-500">
                    {/* inner glow */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.12),transparent_60%)]" />
                    
                    {/* Step indicator - moved to top right corner */}
                    <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#00A3FF] flex items-center justify-center text-white text-base font-bold shadow-[0_0_15px_rgba(0,163,255,0.5)] z-20 border border-sky-400/30">
                      {activeStep}/4
                    </div>
                    
                    <div className={`relative flex flex-col items-center text-center transform transition-all duration-500 px-4 z-10 ${animating ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                      <div className="w-28 h-28 rounded-full bg-[#00A3FF] p-1 flex items-center justify-center mb-8 shadow-[0_0_25px_rgba(0,163,255,0.4)] transform hover:rotate-6 transition-transform relative">
                        <div className="absolute inset-0 rounded-full bg-[#0B1324] opacity-40"></div>
                        <div className="relative z-10 transform hover:scale-110 transition-transform">
                          <span className="text-6xl">{steps[activeStep-1].emoji}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-white text-2xl font-semibold mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {steps[activeStep-1].title}
                      </h3>
                      <p className="text-white/80 leading-relaxed text-base max-w-xs">
                        {steps[activeStep-1].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;