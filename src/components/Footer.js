'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '../assets/frontend_resources/logos/onearcade-logo-horizontal.png';

import { FaTwitter, FaDiscord, FaTelegramPlane, FaGithub, FaLock, FaShieldAlt } from 'react-icons/fa';

export default function Footer() {
  const pathname = usePathname();

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const navLinks = useMemo(
    () => [
      { label: 'Home', href: '/' },
      { label: 'Game', href: '/game' },
      { label: 'Bank', href: '/bank' },
      { label: 'About Us', href: '/about-us' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Contact Us', href: '/contact-us' },
    ],
    []
  );

  const supportLinks = useMemo(
    () => [
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms of Service', href: '/terms-of-service' },
      { label: 'Responsible Gaming', href: '/responsible-gaming' },
    ],
    []
  );

  const bottomLinks = useMemo(
    () => [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Cookies', href: '/cookies' },
      { label: 'Play Responsibly', href: '/responsible-gaming' },
    ],
    []
  );

  const linkClass = (href) => {
    const isActive = pathname === href;
    return [
      'text-[15px] transition-colors',
      isActive ? 'text-white' : 'text-[#2F7BFF] hover:text-[#6AA6FF]',
    ].join(' ');
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    console.log('Subscribing email:', email);
    setIsSubscribed(true);
    setEmail('');

    setTimeout(() => setIsSubscribed(false), 2500);
  };

  return (
    <footer className="relative  bg-sharp-black text-white">
      {/* subtle background glow like the screenshot */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-sharp-black blur-[90px]" />
        <div className="absolute -top-24 right-24 h-64 w-64 rounded-full bg-sharp-black blur-[90px]" />
        <div className="absolute bottom-0 left-1/2 h-56 w-[700px] -translate-x-1/2 bg-white/5 blur-[120px]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-0 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left: Logo + copy + socials */}
          <div className="md:col-span-3">
            <Link href="/" className="inline-block">
              <Image src={Logo} alt="OneArcade logo" width={260} height={90} priority />
            </Link>

            <p className="mt-6 text-white/70 leading-relaxed">
              OneArcade is the next-generation decentralized gaming and entertainment platform built on One Chain Network.
              Experience transparent, fair, and secure on-chain gaming where you truly own your assets.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[#2F7BFF] hover:text-[#6AA6FF] transition-colors"
              >
                <FaTwitter size={22} />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="text-[#2F7BFF] hover:text-[#6AA6FF] transition-colors"
              >
                <FaDiscord size={22} />
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="text-[#2F7BFF] hover:text-[#6AA6FF] transition-colors"
              >
                <FaTelegramPlane size={22} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-[#2F7BFF] hover:text-[#6AA6FF] transition-colors"
              >
                <FaGithub size={22} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 md:pl-6">
            <h3 className="text-xl font-semibold">Navigation</h3>
            <ul className="mt-8 space-y-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass(l.href)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold">Support</h3>
            <ul className="mt-8 space-y-4">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass(l.href)}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold">Security</h3>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-[#2F7BFF]/35 bg-[#0B1424]/70 px-5 py-4">
                <FaLock className="text-[#2F7BFF]" />
                <span className="text-[#2F7BFF] font-medium">SSL Secured</span>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#2F7BFF]/35 bg-[#0B1424]/70 px-5 py-4">
                <FaShieldAlt className="text-[#2F7BFF]" />
                <span className="text-[#2F7BFF] font-medium">Provably Fair</span>
              </div>
            </div>
          </div>
          {/* Stay Updated + CTA */}
          <div className="md:col-span-3">
            <h3 className="text-xl font-semibold">Stay Updated</h3>

            <form onSubmit={handleSubscribe} className="mt-8">
            <div className="flex w-full items-center rounded-2xl bg-white/10 ring-1 ring-white/10 p-1 gap-1">
  <input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="min-w-0 flex-1 truncate bg-transparent px-4 sm:px-5 py-4 text-sm text-white placeholder:text-white/40 focus:outline-none"
    required
  />


  <button
    type="submit"
    className="shrink-0 whitespace-nowrap rounded-xl bg-[#2F7BFF] px-4 sm:px-6 py-4 text-sm font-medium text-white hover:bg-[#4B8DFF] transition-colors"
  >
    Subscribe
  </button>
</div>


              {isSubscribed && (
                <div className="mt-2 text-xs text-green-400">Subscribed. Welcome aboard.</div>
              )}
            </form>

            <Link
              href="/game"
              className="mt-8 block w-full rounded-3xl bg-[#2F7BFF] hover:bg-[#3F86FF] transition-colors
                         shadow-[0_18px_50px_rgba(47,123,255,0.35)]"
            >
              <div className="py-8 flex flex-col items-center justify-center gap-4">
                <span className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 7l10 5-10 5V7z" fill="white" />
                  </svg>
                </span>
                <span className="text-3xl font-semibold tracking-tight">Launch Game</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-white/60">
              © {new Date().getFullYear()} OneArcade. All rights reserved.
            </div>

            <div className="flex items-center gap-6">
              {bottomLinks.map((l) => (
                <Link key={l.href} href={l.href} className="text-[#2F7BFF] hover:text-[#6AA6FF] transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
        {/* Compliance Statement */}
         <div className="text-xs text-white/30 text-center mt-6">
           APT-Casino encourages responsible gaming. Please play responsibly and only with funds you can afford to lose.
           Gambling can be addictive. If you need help or advice, please visit <a href="/responsible-gaming" className="underline hover:text-white/50 transition-colors">Responsible Gaming</a>.
         </div>
      </div>
    </footer>
  );
}
