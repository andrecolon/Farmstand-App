/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Smartphone, Monitor, Wifi, Battery, Volume2 } from "lucide-react";

interface DeviceFrameProps {
  children: React.ReactNode;
}

export default function DeviceFrame({ children }: DeviceFrameProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [time, setTime] = useState("9:41 AM");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen py-6 px-4 md:px-8 flex flex-col items-center justify-center transition-colors duration-300">
      {/* Frame Size Switcher for Interactive Demonstration */}
      <div className="mb-6 flex items-center gap-3 bg-zinc-850 p-1.5 rounded-full shadow-lg border border-zinc-700/50 max-w-sm w-full justify-between">
        <span className="text-xs px-3 font-medium text-zinc-400">View Emulator:</span>
        <div className="flex gap-1">
          <button
            onClick={() => setIsFullscreen(false)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              !isFullscreen
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            iPhone Frame
          </button>
          <button
            onClick={() => setIsFullscreen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              isFullscreen
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Responsive Full
          </button>
        </div>
      </div>

      {isFullscreen ? (
        // Fullscreen Mobile web view (fully fluid, taking whole dashboard space)
        <div className="w-full max-w-md bg-stone-900 aspect-[9/19] rounded-[48px] overflow-hidden shadow-2xl border-4 border-stone-800 flex flex-col relative">
          {/* Virtual Top Notch Status Bar */}
          <div className="bg-stone-950 text-white h-11 px-6 flex items-center justify-between text-xs font-semibold select-none shrink-0 z-50">
            <span>{time}</span>
            {/* Dynamic Island style Pill */}
            <div className="w-24 h-4.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-3"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase text-zinc-400 font-mono">Sim GPS</span>
              <Wifi className="w-3.5 h-3.5 text-white" />
              <div className="flex items-center gap-0.5">
                <div className="w-2.5 h-3 bg-white rounded-xs"></div>
                <Battery className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          {/* Main App Canvas */}
          <div className="w-full flex-1 overflow-hidden relative bg-amber-50/10">
            {children}
          </div>
          {/* Virtual iOS home indicator */}
          <div className="bg-stone-950 h-5 flex justify-center items-center shrink-0 w-full z-40 select-none">
            <div className="w-28 h-1 bg-stone-700/82 rounded-full mb-1"></div>
          </div>
        </div>
      ) : (
        // Spectacular Physical Phone Mockup container with deep wood accents shadow
        <div className="relative">
          {/* Physical Side Buttons */}
          <div className="absolute left-[-16px] top-28 w-1 h-14 bg-zinc-600 rounded-l-md shadow-md border-r border-zinc-700"></div>
          <div className="absolute left-[-16px] top-48 w-1 h-12 bg-zinc-600 rounded-l-md shadow-md border-r border-zinc-700"></div>
          <div className="absolute right-[-16px] top-36 w-1 h-16 bg-zinc-600 rounded-r-md shadow-md border-l border-zinc-700"></div>

          {/* Core Outer Frame */}
          <div className="w-[390px] h-[820px] bg-zinc-950 rounded-[56px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] ring-12 ring-zinc-800/80 ring-offset-2 ring-offset-zinc-900 border-2 border-zinc-700 outline-none flex flex-col relative select-none">
            
            {/* Glare effect overlay */}
            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-tr from-white/0 via-white/2 to-white/10 rounded-t-[44px] pointer-events-none z-50"></div>
            
            {/* Internal Smartphone Shell Container */}
            <div className="w-full h-full rounded-[44px] bg-stone-950 overflow-hidden flex flex-col relative border border-black shadow-inner">
              
              {/* Actual Native Status Bar */}
              <div className="bg-stone-950 text-white h-12 px-6 pt-1 flex items-center justify-between text-[11px] font-bold select-none shrink-0 z-50">
                <span>{time}</span>
                {/* Simulated Physical Punchhole Notch */}
                <div className="w-28 h-5.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-4 flex items-center justify-center border border-zinc-800/20 shadow-inner">
                  {/* Camera lens glow */}
                  <div className="w-2 h-2 rounded-full absolute right-3 bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <div className="w-1 h-0.5 bg-sky-900 rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 opacity-90">
                  <span className="text-[9px] tracking-wide text-amber-500 font-bold bg-amber-500/10 px-1 rounded-sm border border-amber-500/15">BVS SIM</span>
                  <Wifi className="w-3.5 h-3.5 text-white" />
                  <div className="flex items-center gap-0.5">
                    <div className="w-2.5 h-3 bg-green-500 rounded-xs"></div>
                    <Battery className="w-[17px] h-[17px] text-white" />
                  </div>
                </div>
              </div>

              {/* Mounted Tab Workspace */}
              <div className="w-full flex-1 overflow-hidden relative bg-amber-50/10 text-stone-800">
                {children}
              </div>

              {/* iOS home navigation bar gesture pill spacer */}
              <div className="bg-stone-950 h-5 flex justify-center items-center shrink-0 w-full z-40">
                <div className="w-32 h-1 bg-zinc-750 rounded-full mb-1"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
