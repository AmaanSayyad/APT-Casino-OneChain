import React from "react";

export default function GradientBorderButton({ children, classes }) {
  return (
    <div
      className={`bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 rounded-sm p-0.5 cursor-pointer transition-all duration-300 ${classes}`}
    >
      <div className="bg-[#0A0F17] rounded-sm px-4 h-full justify-center font-display py-1 flex items-center text-white">
        {children}
      </div>
    </div>
  );
}
