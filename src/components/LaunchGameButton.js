"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function LaunchGameButton() {
  const router = useRouter();

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);
  
  return (
    <a
      className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white font-medium px-6 py-2 rounded-[30px] hover:from-[#0066FF] hover:to-[#00A3FF] hover:shadow-[0_0_20px_rgba(0,163,255,0.8),0_0_40px_rgba(0,163,255,0.4)] transition-all cursor-pointer"
      type="button" 
      href="/game"
    >
      Launch game
    </a>
  );
}
