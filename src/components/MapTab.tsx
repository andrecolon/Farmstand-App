/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { FarmStand, UserLocation } from "../types";
import { 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  MapPin, 
  Navigation, 
  Layers, 
  Star, 
  Calendar, 
  Clock, 
  Phone, 
  ArrowRight, 
  Info,
  Route
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MapTabProps {
  stands: FarmStand[];
  activeStandId: number | null;
  onSelectStand: (id: number) => void;
  userLocation: UserLocation;
  onSetUserLocation: (loc: UserLocation) => void;
  locationsList: UserLocation[];
}

export default function MapTab({
  stands,
  activeStandId,
  onSelectStand,
  userLocation,
  onSetUserLocation,
  locationsList
}: MapTabProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapType, setMapType] = useState<"illustrated" | "minimal">("illustrated");
  const [isNavigating, setIsNavigating] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  const activeStand = stands.find((s) => s.id === activeStandId);

  // SVG dimensions for mapping (internal virtual coordinate space)
  const SVG_WIDTH = 600;
  const SVG_HEIGHT = 560;

  // Zoom limits
  const minZoom = 0.85;
  const maxZoom = 2.5;

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 0.2, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 0.2, minZoom));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsNavigating(false);
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch pan handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Distance calculator helper
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    // distance scaled to miles. BVS in coordinates translates to rough mountain roads
    const dx = x2 - x1;
    const dy = y2 - y1;
    const unitDistance = Math.sqrt(dx * dx + dy * dy);
    return Math.max(0.4, Number((unitDistance * 0.12).toFixed(1)));
  };

  // Travel time estimation
  const estimateTime = (miles: number) => {
    const min = Math.round(miles * 2.2);
    if (min < 2) return "2 mins";
    return `${min} mins`;
  };

  // Generate customized routing instruction steps based on simulated starting site
  const generateDirections = () => {
    if (!activeStand) return [];
    const dist = calculateDistance(userLocation.x, userLocation.y, activeStand.x, activeStand.y);
    return [
      {
        text: `Depart from ${userLocation.name} heading toward local crossroad.`,
        detail: "Ensure your trunk is cleared for farm goods!",
        icon: "start"
      },
      {
        text: `Continue ${dist > 5 ? "along the beautiful Tehachapi mountain corridor" : "down the local oak tree boulevard"}.`,
        detail: `Drive approximately ${(dist * 0.7).toFixed(1)} miles. Watch out for local mountain deer!`,
        icon: "drive"
      },
      {
        text: `Turn right on ${activeStand.address.split(" ").slice(-2).join(" ")} toward ${activeStand.town}.`,
        detail: `Look for the hand-painted rustic signs! Opening is active: ${activeStand.hours.split(":")[0]}.`,
        icon: "turn"
      },
      {
        text: `Welcome to ${activeStand.name}!`,
        detail: `Park on the gravel shoulder right in front of the stand.`,
        icon: "arrive"
      }
    ];
  };

  const directionSteps = generateDirections();

  return (
    <div className="w-full h-full flex flex-col bg-stone-100 select-none overflow-hidden relative">
      
      {/* Top Controls Overlay */}
      <div className="absolute top-2.5 inset-x-2.5 flex flex-col gap-2 z-30 pointer-events-none">
        
        {/* User simulated GPS point changer */}
        <div className="bg-amber-50/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-md border border-amber-900/10 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wide font-extrabold text-stone-400">Current Position</span>
              <select
                aria-label="Set Simulated GPS position"
                value={userLocation.name}
                onChange={(e) => {
                  const selected = locationsList.find((l) => l.name === e.target.value);
                  if (selected) onSetUserLocation(selected);
                }}
                className="text-[12px] font-extrabold text-stone-800 bg-transparent py-0 px-0 outline-none border-none cursor-pointer focus:ring-0"
              >
                {locationsList.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={() => {
              // Trigger random small jitter
              setPan({ x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10 });
            }}
            className="p-1 px-1.5 rounded-lg border border-stone-200/50 bg-white shadow-sm hover:bg-stone-50 text-blue-600 transition"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
          </button>
        </div>

        {/* Small layer switcher and reset buttons on right */}
        <div className="flex gap-2 justify-between">
          {/* Map Layer Option */}
          <div className="flex gap-1 bg-white/90 backdrop-blur px-1 py-1 rounded-xl shadow-sm border border-stone-200/60 pointer-events-auto">
            <button
              onClick={() => setMapType("illustrated")}
              className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                mapType === "illustrated" 
                  ? "bg-amber-100 text-amber-900" 
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Illustrated
            </button>
            <button
              onClick={() => setMapType("minimal")}
              className={`p-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                mapType === "minimal" 
                  ? "bg-blue-100 text-blue-900" 
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Slick Grid
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex bg-white/95 backdrop-blur items-center rounded-xl shadow-sm border border-stone-200 pointer-events-auto">
            <button
              onClick={handleZoomIn}
              className="p-2 border-r border-stone-200 hover:bg-stone-50 text-stone-600 active:bg-stone-100"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 border-r border-stone-200 hover:bg-stone-50 text-stone-600 active:bg-stone-100"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleReset}
              className="text-[10px] font-bold px-2.5 uppercase tracking-wider text-amber-800 hover:bg-stone-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Primary SVG / Map canvas */}
      <div
        ref={mapContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full flex-1 touch-none overflow-hidden relative cursor-grab active:cursor-grabbing transition-colors duration-300 ${
          mapType === "illustrated" ? "bg-amber-50/70" : "bg-zinc-900"
        }`}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
          className="w-[600px] h-[560px] relative transition-transform duration-100 ease-out absolute left-1/2 top-1/2 -ml-[300px] -mt-[280px]"
        >
          {mapType === "illustrated" ? (
            /* Illustrated Hand-Drawn Slate Background */
            <div className="absolute inset-0 select-none overflow-hidden rounded-[40px] pointer-events-none">
              {/* Mountain ranges in top header */}
              <div className="absolute top-[80px] left-[15%] w-[180px] h-[80px] opacity-75">
                <div 
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  className="absolute bottom-0 left-0 w-[110px] h-[65px] bg-gradient-to-tr from-emerald-800 to-emerald-500"
                ></div>
                <div 
                  style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
                  className="absolute bottom-0 left-[60px] w-[130px] h-[82px] bg-gradient-to-tr from-teal-800 to-teal-500/80"
                ></div>
              </div>

              {/* Oak Wood Valley Background Textures */}
              <div className="absolute inset-[40px] rounded-[30%] border border-amber-900/10 rotate-[-5deg] opacity-20 bg-radial from-amber-200/20 to-transparent"></div>

              {/* Forest tree clumps */}
              <div className="absolute bottom-[110px] right-[140px] text-3xl opacity-80 animate-bounce-slow">🌳</div>
              <div className="absolute bottom-[80px] right-[210px] text-2xl opacity-75">🌲</div>
              <div className="absolute top-[110px] left-[45px] text-3xl opacity-60">🌳</div>
              
              {/* Cute Icons matching positions */}
              <div className="absolute top-[280px] left-[120px] text-2xl select-none animate-pulse-slow">🥚</div>
              <div className="absolute bottom-[130px] left-[320px] text-3xl select-none">🐎</div>
              <div className="absolute top-[280px] right-[180px] text-3xl select-none">🐓</div>
              <div className="absolute bottom-[90px] right-[100px] text-3xl select-none animate-bounce-slow">🍎</div>

              {/* Hand-sketched Mountain Pass Road System */}
              <svg className="absolute inset-0 w-full h-full stroke-orange-700/35 fill-none stroke-[6] stroke-dasharray-[1,4] stroke-linecap-round opacity-80">
                {/* Meadow path 1 */}
                <path d="M 120,410 C 200,430 320,480 410,490" />
                {/* Valley road 2 */}
                <path d="M 220,190 C 230,220 280,360 410,490" />
                {/* Ridge climb 3 */}
                <path d="M 240,90 C 220,190 120,110 50,116" />
                {/* Stallion road connector */}
                <path d="M 140,210 C 180,360 380,440 410,490" />
                {/* Golden Hills bypass to Stallion */}
                <path d="M 670,200 C 570,220 410,490 380,440" />
                {/* Custom trail cross connections */}
                <path d="M 28,36 C 14,21 30,17 46,86" className="stroke-amber-600/40 stroke-[4]" />
              </svg>

              {/* Town labels */}
              <div className="absolute top-[85px] left-[90px] text-stone-600/80 font-gaegu font-bold text-lg text-center leading-none">
                Bear Valley<br/><span className="text-stone-400 font-sans text-[10px] uppercase font-bold tracking-widest">Springs Valley</span>
              </div>
              <div className="absolute top-[175px] right-[180px] text-stone-600/80 font-gaegu font-bold text-lg text-center leading-none">
                Golden Hills<br/><span className="text-stone-400 font-sans text-[10px] uppercase font-bold tracking-widest">Crossings</span>
              </div>
              <div className="absolute bottom-[150px] left-[85px] text-stone-600/80 font-gaegu font-bold text-lg text-center leading-none">
                Stallion Springs<br/><span className="text-stone-400 font-sans text-[10px] uppercase font-bold tracking-widest">Homestead Meadows</span>
              </div>
              <div className="absolute top-[255px] right-[50px] text-emerald-800/80 font-gaegu font-bold text-2xl text-center leading-none rotate-2">
                Tehachapi
              </div>
            </div>
          ) : (
            /* Super slick high-fidelity futuristic vector grid */
            <div className="absolute inset-0 bg-neutral-900 pointer-events-none overflow-hidden rounded-[40px]">
              {/* Radial glow background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/15 via-neutral-900 to-black"></div>
              {/* Custom Blueprint lines */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              <svg className="absolute inset-0 w-full h-full stroke-blue-500/20 fill-none stroke-[3] stroke-linecap-round">
                {/* Cyber highways */}
                <path d="M 80,100 L 520,100" />
                <path d="M 120,450 L 520,450" />
                <path d="M 150,80 L 150,480" />
                <path d="M 450,80 L 450,480" />
                <path d="M 80,250 C 300,280 400,380 520,380" className="stroke-indigo-500/15 stroke-[4]" />
              </svg>
            </div>
          )}

          {/* SVG Route Navigation Animation layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <AnimatePresence>
              {isNavigating && activeStand && (
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  // Symmetrical Bezier curve linking user to the stand
                  d={`M ${userLocation.x * SVG_WIDTH / 100}, ${userLocation.y * SVG_HEIGHT / 100} 
                     C ${(userLocation.x + activeStand.x)/2 * SVG_WIDTH / 100}, ${Math.min(userLocation.y, activeStand.y) * SVG_HEIGHT / 100 - 45}
                       ${(userLocation.x + activeStand.x)/2 * SVG_WIDTH / 100}, ${Math.max(userLocation.y, activeStand.y) * SVG_HEIGHT / 100 + 45}
                       ${activeStand.x * SVG_WIDTH / 100}, ${activeStand.y * SVG_HEIGHT / 100}`}
                  className="stroke-amber-500 fill-none stroke-[4] stroke-linecap-round stroke-dasharray-[6,6]"
                />
              )}
            </AnimatePresence>
          </svg>

          {/* User Location Pulsing Pointer Pin */}
          <div
            style={{
              left: `${userLocation.x}%`,
              top: `${userLocation.y}%`,
            }}
            className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-emerald-400 opacity-40"></span>
              <div className="h-6 w-6 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center text-white text-[9px] font-bold">
                <Navigation className="w-3 h-3 fill-white" />
              </div>
              <div className="absolute top-7 bg-emerald-950 text-white font-extrabold text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap border border-emerald-500/20">
                You Here
              </div>
            </div>
          </div>

          {/* Render Farm Pins */}
          {stands.map((farm) => {
            const isActive = farm.id === activeStandId;
            return (
              <button
                key={farm.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStand(farm.id);
                  // Turn off navigation first when selection shifts, for neat flow
                  setIsNavigating(false);
                }}
                style={{
                  left: `${farm.x}%`,
                  top: `${farm.y}%`,
                }}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group pointer-events-auto`}
              >
                <div 
                  className={`w-11 h-11 rounded-full flex flex-col items-center justify-center font-extrabold text-sm border-2 shadow-lg transition-transform duration-200 ${
                    isActive 
                      ? "bg-amber-500 text-stone-950 border-white scale-115 ring-4 ring-amber-500/30" 
                      : "bg-blue-600 text-white border-blue-100 hover:scale-108 hover:bg-amber-600 hover:text-white"
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] -mt-0.5">{farm.id}</span>
                </div>
                
                {/* Floating Tag display on hover */}
                <div className="absolute top-12 bg-stone-900/95 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none border border-zinc-800">
                  {farm.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Sheets and Details Panel - iOS native style drawer */}
      <div className="p-3 bg-white border-t border-stone-200 rounded-t-3xl shadow-xl z-30 shrink-0 select-text">
        <AnimatePresence mode="wait">
          {activeStand ? (
            <motion.div
              key={activeStand.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col"
            >
              {/* Action and Title Bar */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-amber-500 text-stone-900 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">
                      Stand #{activeStand.id}
                    </span>
                    <span className="text-[11px] font-bold text-stone-400 capitalize">
                      {activeStand.town}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-stone-900 font-sans tracking-tight leading-tight mt-0.5">
                    {activeStand.name}
                  </h3>
                </div>

                <div className="text-right">
                  {/* Realtime Distance and travel timing */}
                  <div className="bg-blue-50 border border-blue-100 p-1 px-2 rounded-xl text-right">
                    <span className="text-xs font-black text-blue-800 block leading-tight">
                      {calculateDistance(userLocation.x, userLocation.y, activeStand.x, activeStand.y)} miles
                    </span>
                    <span className="text-[9px] text-blue-600 block leading-none font-bold">
                      ~{estimateTime(calculateDistance(userLocation.x, userLocation.y, activeStand.x, activeStand.y))} drive
                    </span>
                  </div>
                </div>
              </div>

              {/* Offerings list */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none my-1">
                {activeStand.offerings.map((off, i) => (
                  <span
                    key={i}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[9px] font-extrabold px-2 py-1 rounded-full whitespace-nowrap border border-stone-200/50"
                  >
                    {off}
                  </span>
                ))}
              </div>

              {/* Action buttons drawer */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsNavigating(!isNavigating)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition shadow-sm ${
                    isNavigating
                      ? "bg-stone-900 text-amber-400"
                      : "bg-amber-500 hover:bg-amber-600 text-stone-950"
                  }`}
                >
                  <Route className="w-4 h-4 animate-pulse" />
                  {isNavigating ? "Hide Route" : "Show Driving GPS"}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    // Quick modal / alert warning workaround
                    const element = document.getElementById("browse-tab-trigger");
                    if (element) {
                      element.click();
                      // Set session key to scroll
                      setTimeout(() => {
                        const standCard = document.getElementById(`farm-section-${activeStand.id}`);
                        if (standCard) {
                          standCard.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 250);
                    }
                  }}
                  className="flex items-center justify-center gap-2 border border-stone-200 bg-stone-50 hover:bg-stone-100 py-2.5 rounded-xl text-xs font-extrabold text-stone-700 transition"
                >
                  <Info className="w-4 h-4 text-stone-500" />
                  Full Details Info
                </button>
              </div>

              {/* Interactive simulated steps when directions active */}
              {isNavigating && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="mt-3.5 bg-stone-50 rounded-xl p-2.5 border border-stone-200/80 overflow-y-auto max-h-36 scrollbar-none"
                >
                  <div className="flex items-center justify-between mb-1.5 border-b border-stone-200/60 pb-1">
                    <span className="text-[10px] uppercase font-black tracking-widest text-stone-500 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-amber-600" /> Driving Companion
                    </span>
                    <span className="text-[9px] font-bold text-stone-400">Tehachapi GPS Guide</span>
                  </div>
                  <div className="space-y-2">
                    {directionSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-2 text-xs">
                        <span className="bg-amber-100 text-amber-900 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-black text-[10px]">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-extrabold text-stone-800 leading-tight">{step.text}</p>
                          <p className="text-[10px] text-stone-500 leading-tight mt-0.5">{step.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-6">
              <Compass className="w-7 h-7 mx-auto text-amber-500 mb-1 animate-spin-slow" />
              <p className="text-xs font-extrabold text-stone-800">No Stand Selected</p>
              <p className="text-[10px] text-stone-400">Tap a blue pin numbered 1-8 on the map to query country goods!</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
