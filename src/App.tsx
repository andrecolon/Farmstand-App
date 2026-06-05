/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Map, 
  BookOpen, 
  Sparkles, 
  ShoppingBag, 
  Search, 
  Filter, 
  Heart, 
  Star, 
  Clock, 
  Phone, 
  MapPin, 
  Plus, 
  Check, 
  X, 
  Send, 
  AlertCircle, 
  ChefHat, 
  RotateCcw, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Info,
  Calendar,
  Layers,
  ChevronDown,
  Navigation,
  Share2
} from "lucide-react";
import DeviceFrame from "./components/DeviceFrame";
import MapTab from "./components/MapTab";
import { FarmStand, Review, StockReport, UserLocation, RecipeResponse } from "./types";
import { INITIAL_STANDS, INITIAL_REVIEWS, INITIAL_REPORTS, SIMULATED_SITES } from "./data";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"map" | "browse" | "chef" | "basket">("map");

  // Core App States
  const [stands, setStands] = useState<FarmStand[]>(INITIAL_STANDS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [stockReports, setStockReports] = useState<StockReport[]>(INITIAL_REPORTS);
  const [activeStandId, setActiveStandId] = useState<number | null>(1);
  const [userLocation, setUserLocation] = useState<UserLocation>(SIMULATED_SITES[0]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set([1, 4]));

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTown, setSelectedTown] = useState<string>("all");
  const [browseCategory, setBrowseCategory] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [expandedStandId, setExpandedStandId] = useState<number | null>(1);

  // New Custom Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);

  // Stock reporting Form State
  const [reportItemName, setReportItemName] = useState("");
  const [reportStatus, setReportStatus] = useState<"in_stock" | "low_stock" | "out_of_stock">("in_stock");
  const [reportSuccess, setReportSuccess] = useState(false);

  // Simulated Dialer State
  const [callingStand, setCallingStand] = useState<FarmStand | null>(null);

  // AI Chef States
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [chefLoading, setChefLoading] = useState(false);
  const [chefResponse, setChefResponse] = useState<RecipeResponse | null>(null);
  const [customIngredient, setCustomIngredient] = useState("");

  // Homesteader Basket checklist
  const [todoItems, setTodoItems] = useState([
    { id: 1, text: "Grab fresh sourdough from Silva Farm", completed: false },
    { id: 2, text: "Check for pasture duck eggs at Irie Farms", completed: true },
    { id: 3, text: "Buy localized honey jars", completed: false }
  ]);
  const [newTodoText, setNewTodoText] = useState("");

  // Custom Stand creation form
  const [showAddStandForm, setShowAddStandForm] = useState(false);
  const [newStandName, setNewStandName] = useState("");
  const [newStandAddress, setNewStandAddress] = useState("");
  const [newStandTown, setNewStandTown] = useState<"Bear Valley Springs" | "Stallion Springs" | "Golden Hills" | "Tehachapi Town">("Bear Valley Springs");
  const [newStandHours, setNewStandHours] = useState("");
  const [newStandPhone, setNewStandPhone] = useState("");
  const [newStandDescription, setNewStandDescription] = useState("");
  const [newStandX, setNewStandX] = useState(50);
  const [newStandY, setNewStandY] = useState(50);
  const [newStandOfferings, setNewStandOfferings] = useState<string[]>([]);
  const [customOfferingTag, setCustomOfferingTag] = useState("");

  // Sync expanded stand on list with map interaction
  useEffect(() => {
    if (activeStandId !== null) {
      setExpandedStandId(activeStandId);
    }
  }, [activeStandId]);

  // Action: Add new custom farm stand
  const handleCreateStand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStandName || !newStandAddress || !newStandHours) return;

    const newId = stands.length + 1;
    const newStand: FarmStand = {
      id: newId,
      name: newStandName,
      address: newStandAddress,
      town: newStandTown,
      offerings: newStandOfferings.length > 0 ? newStandOfferings : ["Fresh Veggies", "Baked Goods"],
      markerClass: `marker-${newId}`,
      x: Number(newStandX),
      y: Number(newStandY),
      image: "homesteader",
      hours: newStandHours,
      phone: newStandPhone || "(661) 555-0100",
      rating: 5.0,
      description: newStandDescription || "A beautiful proud local neighbors backyard stand with homegrown goods.",
      isCustom: true,
      verified: false
    };

    setStands([...stands, newStand]);
    setActiveStandId(newId);
    setExpandedStandId(newId);
    
    // Reset fields
    setNewStandName("");
    setNewStandAddress("");
    setNewStandHours("");
    setNewStandPhone("");
    setNewStandDescription("");
    setNewStandOfferings([]);
    setShowAddStandForm(false);
    setActiveTab("map");
  };

  // Action: Add custom tag
  const handleAddOfferingTag = () => {
    if (customOfferingTag.trim()) {
      setNewStandOfferings([...newStandOfferings, customOfferingTag.trim()]);
      setCustomOfferingTag("");
    }
  };

  // Action: Submit Review info
  const handleAddReview = (e: React.FormEvent, farmId: number) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      farmId,
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    };

    setReviews([newRev, ...reviews]);
    
    // Recalculate average rating
    const currentStandReviews = [newRev, ...reviews.filter(r => r.farmId === farmId)];
    const avg = currentStandReviews.reduce((sum, r) => sum + r.rating, 0) / currentStandReviews.length;
    
    setStands(stands.map(s => {
      if (s.id === farmId) {
        return { ...s, rating: Number(avg.toFixed(1)) };
      }
      return s;
    }));

    // Reset Review form
    setReviewName("");
    setReviewComment("");
    setShowReviewSuccess(true);
    setTimeout(() => setShowReviewSuccess(false), 3000);
  };

  // Action: Submit Stock report
  const handleAddStockReport = (e: React.FormEvent, farmId: number) => {
    e.preventDefault();
    if (!reportItemName) return;

    const newReport: StockReport = {
      id: `rep-${Date.now()}`,
      farmId,
      item: reportItemName,
      status: reportStatus,
      reportedBy: "Passerby_" + Math.floor(Math.random() * 900 + 100),
      timestamp: "Just now"
    };

    setStockReports([newReport, ...stockReports]);
    setReportItemName("");
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 3000);
  };

  // Action: Toggle favorites status
  const toggleFavorite = (id: number) => {
    const next = new Set(favorites);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setFavorites(next);
  };

  // Action: Ask Maverick API
  const handleQueryChef = async () => {
    if (selectedIngredients.length === 0) return;
    setChefLoading(true);
    setChefResponse(null);

    const activeStand = stands.find(s => s.id === activeStandId);

    try {
      const response = await fetch("/api/chef/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          standName: activeStand?.name || "Tehachapi Farm Stands",
          dietary: dietaryPreference
        })
      });

      if (!response.ok) {
        throw new Error("Recipe endpoint error");
      }

      const data = await response.json();
      setChefResponse(data);
    } catch (err) {
      console.error("AI Generation issue", err);
    } finally {
      setChefLoading(false);
    }
  };

  // Custom Ingredients Handler
  const handleAddCustomIngredient = () => {
    if (customIngredient.trim()) {
      setSelectedIngredients([...selectedIngredients, customIngredient.trim()]);
      setCustomIngredient("");
    }
  };

  // Homesteader checklist todo actions
  const toggleTodo = (id: number) => {
    setTodoItems(todoItems.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTodo = (id: number) => {
    setTodoItems(todoItems.filter(t => t.id !== id));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      setTodoItems([...todoItems, { id: Date.now(), text: newTodoText.trim(), completed: false }]);
      setNewTodoText("");
    }
  };

  // Categories helper extract
  const allCategories = ["all", ...new Set(stands.flatMap(s => s.offerings))];

  // Filtering implementation
  const filteredFarms = stands.filter((farm) => {
    const townMatch = selectedTown === "all" || farm.town.toLowerCase().includes(selectedTown.toLowerCase());
    const categoryMatch = browseCategory === "all" || farm.offerings.some(item => item.toLowerCase() === browseCategory.toLowerCase());
    const favoriteMatch = !onlyFavorites || favorites.has(farm.id);

    const searchable = [farm.name, farm.address, farm.town, ...farm.offerings].join(" ").toLowerCase();
    const queryMatch = searchable.includes(searchQuery.toLowerCase().trim());

    return townMatch && categoryMatch && favoriteMatch && queryMatch;
  });

  return (
    <div className="absolute inset-x-0 top-0 bottom-0 min-h-screen bg-stone-950 flex flex-col justify-between overflow-x-hidden md:py-6 overflow-y-auto">
      
      {/* Title & Slogan Header on desktop only */}
      <div className="hidden lg:block text-center mt-4 shrink-0 transition-opacity">
        <h1 className="font-gaegu text-4xl md:text-5xl font-black tracking-wider text-amber-500 uppercase leading-none drop-shadow-md">
          Tehachapi Farm Stands
        </h1>
        <p className="text-stone-400 font-medium text-xs mt-1.5 max-w-lg mx-auto">
          Country-style native companion simulator for Bear Valley, Stallion Springs, and Golden Hills.
        </p>
      </div>

      <DeviceFrame>
        <div id="native-app-root" className="w-full h-full flex flex-col bg-stone-900 text-stone-100 select-text font-sans select-none overflow-hidden pb-4">
          
          {/* Native Title Header Bar */}
          <div className="bg-stone-950 px-4 py-3 flex items-center justify-between border-b border-stone-850 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-stone-950 font-black text-xs font-gaegu shadow">
                🚜
              </div>
              <div>
                <h2 className="text-xs font-black tracking-tight text-white leading-none">Tehachapi Farm Stands</h2>
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest block leading-none mt-0.5">Mobile Guide</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                type="button"
                onClick={() => {
                  alert("Tehachapi Farm Guide simulated coordinates link copied! Open on a real mobile browser to save standalone icon.");
                }}
                className="p-1.5 hover:bg-stone-850 rounded-lg text-stone-400 hover:text-white transition"
                title="Share Guide Link"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-500" />
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowAddStandForm(!showAddStandForm);
                  setActiveTab("basket");
                }}
                className="bg-amber-500 text-stone-950 hover:bg-amber-600 font-extrabold text-[10px] px-2 py-1 rounded-lg flex items-center gap-1 transition-all"
                title="Add custom stand pin"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Stand
              </button>
            </div>
          </div>

          {/* Active View Container with Tab Swapping animations */}
          <div className="flex-1 w-full overflow-hidden relative bg-stone-900">
            <AnimatePresence mode="wait">
              
              {/* Tab 1: Interactive SVG Maps */}
              {activeTab === "map" && (
                <motion.div
                  key="map-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full"
                >
                  <MapTab 
                    stands={stands}
                    activeStandId={activeStandId}
                    onSelectStand={(id) => {
                      setActiveStandId(id);
                      setExpandedStandId(id);
                    }}
                    userLocation={userLocation}
                    onSetUserLocation={setUserLocation}
                    locationsList={SIMULATED_SITES}
                  />
                </motion.div>
              )}

              {/* Tab 2: Directory Directory */}
              {activeTab === "browse" && (
                <motion.div
                  key="browse-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full flex flex-col bg-stone-950 overflow-y-auto"
                >
                  {/* Search and Filters container */}
                  <div className="p-3 bg-stone-900 border-b border-stone-850 flex flex-col gap-2 sticky.ts top-0 z-10 shrink-0">
                    <div className="relative">
                      <input
                        id="browse-search"
                        aria-label="Search produce, bakeries, or offerings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search eggs, sourdough, tallow..."
                        type="text"
                        className="w-full bg-stone-950 text-white placeholder-stone-500 text-xs font-semibold py-2.5 pl-8.5 pr-8 rounded-xl border border-stone-800 outline-none focus:border-amber-500/50 transition-colors"
                      />
                      <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-2.5 p-0.5 rounded-full hover:bg-stone-800 text-stone-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Pills list */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
                        <select
                          aria-label="Filter Area"
                          value={selectedTown}
                          onChange={(e) => setSelectedTown(e.target.value)}
                          className="bg-stone-950 text-white rounded-lg px-2 py-1.5 text-[10px] font-black border border-stone-850 cursor-pointer min-w-28 outline-none"
                        >
                          <option value="all">🌐 All Areas</option>
                          <option value="Bear Valley">🐻 Bear Valley</option>
                          <option value="Stallion Springs">🐎 Stallion Springs</option>
                          <option value="Golden Hills">🌾 Golden Hills</option>
                        </select>

                        <select
                          aria-label="Filter Offerings"
                          value={browseCategory}
                          onChange={(e) => setBrowseCategory(e.target.value)}
                          className="bg-stone-950 text-white rounded-lg px-2 py-1.5 text-[10px] font-black border border-stone-850 cursor-pointer min-w-28 capitalize outline-none"
                        >
                          <option value="all">🧁 All Categories</option>
                          {allCategories.filter(c => c !== "all").map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Favorites switch and stands match counter */}
                      <div className="flex items-center justify-between px-1 text-[10px] text-stone-400 font-bold">
                        <button
                          onClick={() => setOnlyFavorites(!onlyFavorites)}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${
                            onlyFavorites 
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                              : "border-stone-800 text-stone-400"
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${onlyFavorites ? "fill-amber-500" : ""}`} />
                          Favorites Only ({favorites.size})
                        </button>
                        <span>
                          {filteredFarms.length} of {stands.length} farm stands
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* stands Directory */}
                  <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 max-h-[580px] scrollbar-none">
                    {filteredFarms.length === 0 ? (
                      <div className="text-center py-12 px-4 bg-stone-900 rounded-2xl border border-stone-850">
                        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-1 opacity-70" />
                        <h4 className="text-xs font-black text-white">No Farm Stands Found</h4>
                        <p className="text-[10px] text-stone-500 max-w-xs mx-auto mt-1">
                          Try adjustments to your search queries or switch off your favorites-only toggle!
                        </p>
                      </div>
                    ) : (
                      filteredFarms.map((farm) => {
                        const isExpanded = expandedStandId === farm.id;
                        const isFav = favorites.has(farm.id);
                        const distanceNum = Math.max(0.4, Number((Math.sqrt(Math.pow(userLocation.x - farm.x, 2) + Math.pow(userLocation.y - farm.y, 2)) * 0.12).toFixed(1)));
                        
                        // Grab reviews and reports for this particular stand
                        const farmReviews = reviews.filter(r => r.farmId === farm.id);
                        const farmReports = stockReports.filter(r => r.farmId === farm.id);

                        return (
                          <div 
                            key={farm.id} 
                            id={`farm-section-${farm.id}`}
                            className={`rounded-2xl border transition-all text-xs overflow-hidden ${
                              isExpanded 
                                ? "bg-stone-900 border-amber-500/20 shadow-lg" 
                                : "bg-stone-900/40 border-stone-850 hover:bg-stone-900/80"
                            }`}
                          >
                            {/* Stand summary card block */}
                            <div 
                              onClick={() => {
                                setExpandedStandId(isExpanded ? null : farm.id);
                                setActiveStandId(farm.id);
                              }}
                              className="p-3.5 flex justify-between items-start gap-2 cursor-pointer"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 font-extrabold text-[10px] flex items-center justify-center">
                                    {farm.id}
                                  </span>
                                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 block max-w-xs truncate">
                                    {farm.town}
                                  </span>
                                  {farm.isCustom && (
                                    <span className="text-[8px] bg-indigo-500/20 text-indigo-400 font-black px-1.5 py-0.5 rounded-md">
                                      Sim Homestead
                                    </span>
                                  )}
                                  {farm.verified && (
                                    <span className="text-[8px] bg-emerald-500/20 text-emerald-400 font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                                      <Check className="w-2 h-2" /> Verified
                                    </span>
                                  )}
                                </div>

                                <h3 className="text-sm font-black text-white mt-1 leading-tight flex items-center gap-1">
                                  {farm.name}
                                </h3>

                                <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1 max-w-sm truncate font-medium">
                                  <MapPin className="w-3 h-3 shrink-0 text-stone-500" />
                                  {farm.address}
                                </p>

                                {/* Tags block */}
                                <div className="flex flex-wrap gap-1 mt-2.5">
                                  {farm.offerings.slice(0, 3).map((item, i) => (
                                    <span key={i} className="bg-stone-950 text-stone-300 px-2 py-0.5 rounded text-[8px] font-black border border-stone-850">
                                      {item}
                                    </span>
                                  ))}
                                  {farm.offerings.length > 3 && (
                                    <span className="text-amber-500 px-1 py-0.5 rounded text-[8px] font-black">
                                      +{farm.offerings.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Distance / Rating status box */}
                              <div className="text-right flex flex-col items-end shrink-0 justify-between h-full">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFavorite(farm.id);
                                  }}
                                  className="p-1 rounded-full text-stone-400 hover:text-red-500 transition-colors"
                                >
                                  <Heart className={`w-4 h-4 ${isFav ? "fill-amber-500 text-amber-500" : ""}`} />
                                </button>
                                
                                <div className="mt-3.5 text-right">
                                  <span className="text-[10px] font-black text-white block">
                                    📍 {distanceNum} mi
                                  </span>
                                  <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-bold leading-tight mt-1">
                                    <Star className="w-3 h-3 fill-amber-500 stroke-none" /> {farm.rating || "5.0"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Expanded Details body */}
                            {isExpanded && (
                              <div className="border-t border-stone-850 bg-stone-900/60 p-3.5 space-y-4">
                                
                                {/* Quick Intro Description */}
                                {farm.description && (
                                  <div>
                                    <h4 className="text-[10px] uppercase font-black text-stone-400 tracking-wider">Homestead Story</h4>
                                    <p className="text-[11px] text-stone-300 leading-normal mt-0.5 italic">
                                      "{farm.description}"
                                    </p>
                                  </div>
                                )}

                                {/* Specific Info (Hours, dial line, routing coordinates action) */}
                                <div className="grid grid-cols-2 gap-2 text-stone-300">
                                  <div className="bg-stone-900 border border-stone-800 p-2.5 rounded-xl">
                                    <div className="flex items-center gap-1.5 text-amber-500 font-black text-[9px] uppercase">
                                      <Clock className="w-3 h-3" /> Stand Hours
                                    </div>
                                    <p className="text-[10px] font-bold text-stone-100 mt-1 leading-tight">
                                      {farm.hours}
                                    </p>
                                    <span className="text-[8px] bg-emerald-500/15 text-emerald-400 rounded px-1 py-0.5 font-bold mt-1.5 inline-block">
                                      🟢 Always Open Daily Self-Serve
                                    </span>
                                  </div>

                                  <div className="bg-stone-900 border border-stone-800 p-2.5 rounded-xl relative">
                                    <div className="flex items-center gap-1.5 text-amber-500 font-black text-[9px] uppercase">
                                      <Phone className="w-3 h-3" /> Call Line
                                    </div>
                                    <p className="text-[10px] font-bold text-stone-100 mt-1 leading-tight">
                                      {farm.phone}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => setCallingStand(farm)}
                                      className="text-[9px] font-extrabold text-blue-400 hover:underline mt-1 block hover:text-blue-300 flex items-center gap-0.5"
                                    >
                                      ☎️ Dial Sim Line
                                    </button>
                                  </div>
                                </div>

                                {/* Stock Levels Section with Report form */}
                                <div className="bg-stone-950 p-2.5 rounded-2xl border border-stone-850">
                                  <div className="flex justify-between items-center mb-2 border-b border-stone-850 pb-1">
                                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider flex items-center gap-1">
                                      📦 Fresh Produce stock reports
                                    </span>
                                    <span className="text-[8px] text-stone-500 font-bold">Crowdsourced</span>
                                  </div>

                                  {/* List current items inventory reports */}
                                  <div className="space-y-1.5 my-1.5">
                                    {farmReports.length === 0 ? (
                                      <p className="text-[10px] text-stone-500 italic py-1 px-1">
                                        No recent crop stock updates reported yet. Fresh harvest usually comes in Saturdays!
                                      </p>
                                    ) : (
                                      farmReports.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between bg-stone-900 p-1.5 px-2 rounded-xl text-[10px] font-bold">
                                          <span className="text-white font-black">{item.item}</span>
                                          <div className="flex items-center gap-1.5">
                                            <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-extrabold ${
                                              item.status === "in_stock" 
                                                ? "bg-green-500/10 text-green-400" 
                                                : item.status === "low_stock"
                                                  ? "bg-amber-500/10 text-amber-400"
                                                  : "bg-red-500/10 text-red-400"
                                            }`}>
                                              {item.status.replace("_", " ")}
                                            </span>
                                            <span className="text-[8px] text-stone-500">reported {item.timestamp}</span>
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>

                                  {/* Stock report form */}
                                  <form 
                                    onSubmit={(e) => handleAddStockReport(e, farm.id)}
                                    className="mt-3 flex gap-2"
                                  >
                                    <input
                                      value={reportItemName}
                                      onChange={(e) => setReportItemName(e.target.value)}
                                      placeholder="Report e.g., Honey..."
                                      type="text"
                                      className="flex-1 bg-stone-900 border border-stone-800 rounded-lg text-[10px] text-white px-2 py-1 outline-none"
                                    />
                                    <select
                                      aria-label="Stock Status"
                                      value={reportStatus}
                                      onChange={(e) => setReportStatus(e.target.value as any)}
                                      className="bg-stone-900 border border-stone-800 text-stone-300 rounded-lg text-[9px] px-1 cursor-pointer outline-none font-bold"
                                    >
                                      <option value="in_stock">In Stock</option>
                                      <option value="low_stock">Running Low</option>
                                      <option value="out_of_stock">Sold Out</option>
                                    </select>
                                    <button 
                                      type="submit"
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1 rounded-lg text-[10px] shrink-0"
                                    >
                                      Submit
                                    </button>
                                  </form>
                                  {reportSuccess && (
                                    <p className="text-emerald-400 text-[8px] font-black mt-2">
                                      ✓ Crop report posted! Thanks for updating the neighborhood!
                                    </p>
                                  )}
                                </div>

                                {/* Review and Ratings Suite */}
                                <div className="space-y-2">
                                  <h4 className="text-[10px] uppercase font-black text-stone-400 tracking-wider flex items-center justify-between">
                                    <span>Community Guestbook Reviews</span>
                                    <span className="text-amber-400">Total {farmReviews.length}</span>
                                  </h4>

                                  {/* Review List */}
                                  <div className="space-y-2 border-stone-850">
                                    {farmReviews.map((rev) => (
                                      <div key={rev.id} className="bg-stone-950 p-2.5 rounded-xl border border-stone-900">
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                          <div className="flex items-center gap-1 shrink-0">
                                            <span className="text-white">{rev.userName}</span>
                                            <span className="text-stone-500 font-medium">· {rev.date}</span>
                                          </div>
                                          <span className="text-amber-400 text-[9px] flex items-center">
                                            {"★".repeat(rev.rating)}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-stone-300 mt-1 italic leading-snug">
                                          "{rev.comment}"
                                        </p>
                                      </div>
                                    ))}
                                  </div>

                                  {/* post comments form */}
                                  <form 
                                    onSubmit={(e) => handleAddReview(e, farm.id)}
                                    className="bg-stone-950 border border-stone-850 p-2.5 rounded-2xl flex flex-col gap-2 mt-2"
                                  >
                                    <div className="text-[9px] uppercase tracking-wide text-amber-500 font-extrabold border-b border-stone-850 pb-1">
                                      Leave a Guest Review
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <input
                                        required
                                        placeholder="Your Name"
                                        value={reviewName}
                                        onChange={(e) => setReviewName(e.target.value)}
                                        className="bg-stone-900 border border-stone-800 rounded-lg text-[9px] text-white px-2 py-1.5 outline-none"
                                        type="text"
                                      />
                                      <select
                                        aria-label="Rating Stars"
                                        value={reviewRating}
                                        onChange={(e) => setReviewRating(Number(e.target.value))}
                                        className="bg-stone-900 border border-stone-800 text-amber-400 font-black rounded-lg text-[9px] px-1 outline-none cursor-pointer"
                                      >
                                        <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                                        <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                                        <option value={3}>⭐⭐⭐ 3 Stars</option>
                                        <option value={2}>⭐⭐ 2 Stars</option>
                                        <option value={1}>⭐ 1 Star</option>
                                      </select>
                                    </div>

                                    <div className="relative">
                                      <input
                                        required
                                        placeholder="Write helpful advice (e.g. 'Highly recommend the Sourdough bagels!')"
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        className="w-full bg-stone-900 border border-stone-800 rounded-lg text-[9px] text-white pr-9 pl-2 py-1.5 outline-none"
                                        type="text"
                                      />
                                      <button
                                        type="submit"
                                        className="absolute right-1.5 top-1 font-extrabold text-[9px] text-amber-500 hover:text-amber-400 p-1"
                                      >
                                        <Send className="w-3.5 h-3.5" />
                                      </button>
                                    </div>

                                    {showReviewSuccess && (
                                      <p className="text-[8px] text-emerald-400 font-black leading-none py-0.5">
                                        ✓ Review published inside simulated state! Town score updated!
                                      </p>
                                    )}
                                  </form>
                                </div>

                                {/* Driving Coordinate Linkage */}
                                <div className="flex gap-2 justify-end mt-3">
                                  <button
                                    onClick={() => {
                                      setActiveStandId(farm.id);
                                      setActiveTab("map");
                                    }}
                                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-3.5 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-1 border border-amber-400 shadow-sm transition"
                                  >
                                    <Navigation className="w-3 h-3 fill-stone-950" />
                                    Locate Pin
                                  </button>
                                </div>

                              </div>
                            )}

                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 3: Chef Maverick AI Cooking */}
              {activeTab === "chef" && (
                <motion.div
                  key="chef-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full flex flex-col bg-stone-950 overflow-y-auto px-3.5 py-4 scrollbar-none"
                >
                  <div className="bg-stone-900 border border-stone-850 rounded-2xl p-3.5 flex gap-3 items-center sticky.ts top-0 z-10 shrink-0">
                    <div className="w-12 h-12 rounded-full border-2 border-amber-500 bg-amber-500/10 flex items-center justify-center text-3xl shrink-0 select-none">
                      🤠
                    </div>
                    <div>
                      <h4 className="font-gaegu text-xl font-bold text-amber-500 leading-none">Maverick's Country Stove</h4>
                      <p className="text-[10px] text-stone-300 mt-1 leading-normal font-medium leading-tight">
                        "Howdy! Pick the beautiful ingredients you loaded in your basket and I'll whip up an absolute country stunner recipe of a lifetime."
                      </p>
                    </div>
                  </div>

                  {/* Checklist of ingredients */}
                  <div className="my-4 space-y-2 border-b border-stone-850 pb-4 shrink-0">
                    <label className="text-[10px] uppercase font-black text-stone-400 tracking-wider">
                      Select your basket ingredients:
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {["pastured eggs", "sourdough", "baguettes", "local honey", "sweet veggies", "dahlias/flowers", "clay soap", "duck eggs", "apples", "sage/thyme"].map((ing) => {
                        const isChecked = selectedIngredients.includes(ing);
                        return (
                          <button
                            key={ing}
                            type="button"
                            onClick={() => {
                              if (isChecked) {
                                setSelectedIngredients(selectedIngredients.filter(x => x !== ing));
                              } else {
                                setSelectedIngredients([...selectedIngredients, ing]);
                              }
                            }}
                            className={`flex items-center gap-1.5 p-2 rounded-xl text-left text-[11px] font-bold border transition ${
                              isChecked
                                ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                                : "bg-stone-900 border-stone-850 text-stone-300 hover:bg-stone-850"
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[9px] shrink-0 ${
                              isChecked ? "bg-amber-500 border-amber-500 text-stone-950" : "border-stone-700"
                            }`}>
                              {isChecked && "✓"}
                            </span>
                            <span className="capitalize">{ing}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Add simulated custom ingredient */}
                    <div className="flex gap-2 mt-2">
                      <input
                        value={customIngredient}
                        onChange={(e) => setCustomIngredient(e.target.value)}
                        placeholder="Add other ingredient (e.g., pork chops, garlic)..."
                        type="text"
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-lg text-[10px] text-white px-2 py-1 outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomIngredient}
                        className="bg-stone-800 text-stone-200 text-[10px] font-bold px-3 py-1 rounded-lg hover:bg-stone-750 transition"
                      >
                        Add
                      </button>
                    </div>

                    {/* Selected Summary chips list */}
                    {selectedIngredients.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {selectedIngredients.map((item) => (
                          <span key={item} className="bg-stone-950 border border-stone-850 text-stone-300 px-2 py-0.5 rounded text-[8.5px] font-black flex items-center gap-0.5">
                            {item}
                            <button onClick={() => setSelectedIngredients(selectedIngredients.filter(x => x !== item))} className="text-[8px] text-red-400 ml-1">x</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dietary input note and action button */}
                  <div className="space-y-3 shrink-0">
                    <div>
                      <label className="text-[10px] uppercase font-black text-stone-400 tracking-wider">
                        Dietary Preference (Optional):
                      </label>
                      <input
                        value={dietaryPreference}
                        onChange={(e) => setDietaryPreference(e.target.value)}
                        placeholder="E.g., Vegetarian, Gluten-Free, Low sodium..."
                        type="text"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl text-xs text-white px-3 py-2.5 mt-1 outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={selectedIngredients.length === 0 || chefLoading}
                      onClick={handleQueryChef}
                      className={`w-full py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition ${
                        selectedIngredients.length === 0 
                          ? "bg-stone-900 text-stone-600 border border-stone-850 cursor-not-allowed" 
                          : "bg-amber-500 hover:bg-amber-600 text-stone-950 border border-amber-400"
                      }`}
                    >
                      <ChefHat className="w-4 h-4 animate-bounce-slow" />
                      {chefLoading ? "Stirring the Country Stove Pot..." : "Cook with Chef Maverick"}
                    </button>
                  </div>

                  {/* output results container */}
                  <div className="mt-4 pb-12">
                    {chefLoading && (
                      <div className="text-center py-10 bg-stone-900 rounded-2xl border border-stone-850 space-y-4">
                        <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                          <span className="absolute animate-ping h-8 w-8 rounded-full bg-amber-500 opacity-20"></span>
                          <ChefHat className="w-8 h-8 text-amber-500 animate-spin-slow" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">Consulting the Old Homestead Cookbook...</p>
                          <p className="text-[9px] text-stone-500 mt-1 max-w-xs mx-auto">
                            Gemini is matching local Tehachapi altitudes with your garden crops to form elegant recipes!
                          </p>
                        </div>
                      </div>
                    )}

                    {!chefLoading && chefResponse && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-amber-50 text-stone-900 rounded-3xl p-4 shadow-xl border border-amber-200 max-h-[600px]"
                      >
                        <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-2">
                          <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest block font-sans">
                            🤠 Maverick's Special Recipe
                          </span>
                          <span className="text-[9px] text-amber-600 font-bold">
                            Yield: {chefResponse.servings}
                          </span>
                        </div>

                        <h3 className="font-gaegu text-2xl font-bold text-amber-950 leading-tight">
                          {chefResponse.title}
                        </h3>

                        <p className="text-xs text-stone-700 leading-normal mt-1 italic">
                          "{chefResponse.description}"
                        </p>

                        <div className="grid grid-cols-2 gap-2 my-3 text-stone-800 font-bold text-[10px]">
                          <div className="bg-amber-100/60 p-2 rounded-xl text-center">
                            <span className="text-stone-500 block text-[8px] uppercase font-black leading-none">Prep Clock</span>
                            <span className="text-sm font-black text-amber-950 block mt-0.5">{chefResponse.prepTime}</span>
                          </div>
                          <div className="bg-amber-100/60 p-2 rounded-xl text-center">
                            <span className="text-stone-500 block text-[8px] uppercase font-black leading-none">Cooking Time</span>
                            <span className="text-sm font-black text-amber-950 block mt-0.5">{chefResponse.cookTime}</span>
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div className="space-y-1 my-3">
                          <h4 className="text-[10.5px] uppercase font-black text-stone-500 tracking-wider">Stove Ingredients:</h4>
                          <ul className="text-xs text-stone-800 space-y-1 list-disc pl-4 font-semibold">
                            {chefResponse.ingredients.map((ing, i) => (
                              <li key={i} className="leading-tight">{ing}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Directions steps */}
                        <div className="space-y-2 my-4">
                          <h4 className="text-[10.5px] uppercase font-black text-stone-500 tracking-wider">Homestead Preparation steps:</h4>
                          <div className="space-y-2">
                            {chefResponse.steps.map((step, idx) => (
                              <div key={idx} className="flex gap-2 text-[11px] font-semibold leading-relaxed">
                                <span className="bg-amber-200 text-amber-950 font-black w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px]">
                                  {idx + 1}
                                </span>
                                <p className="text-stone-800 flex-1">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Chef Tip */}
                        {chefResponse.chefTips && (
                          <div className="bg-amber-100/80 p-2.5 rounded-2xl border border-amber-200 text-[10.5px] leading-relaxed text-stone-850 mt-3 font-semibold">
                            <span className="text-amber-950 font-black block text-[10px] uppercase font-sans tracking-wide">🤠 Maverick's Mountain Tip</span>
                            <p className="mt-0.5 italic">{chefResponse.chefTips}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tab 4: Homesteader Basket checklist */}
              {activeTab === "basket" && (
                <motion.div
                  key="basket-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full h-full flex flex-col bg-stone-950 overflow-y-auto px-3.5 py-4 scrollbar-none"
                >
                  {/* checklist of bookmarks */}
                  <div className="space-y-3 shrink-0">
                    <div className="flex items-center justify-between border-b border-stone-850 pb-1.5">
                      <h4 className="text-xs uppercase font-black tracking-wider text-stone-400">
                        My Homestead Crop Checkout List
                      </h4>
                      <span className="text-[10px] text-amber-500 font-bold">
                        {todoItems.filter(t => t.completed).length} of {todoItems.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {todoItems.map((todo) => (
                        <div 
                          key={todo.id} 
                          className="flex items-center justify-between bg-stone-900 border border-stone-850 p-2.5 rounded-xl text-xs font-bold"
                        >
                          <div className="flex items-center gap-2 flex-1 mr-2">
                            <button
                              type="button"
                              onClick={() => toggleTodo(todo.id)}
                              className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                                todo.completed
                                  ? "bg-amber-500 border-amber-500 text-stone-950"
                                  : "border-stone-700"
                              }`}
                            >
                              {todo.completed && "✓"}
                            </button>
                            <span className={`text-stone-100 leading-tight flex-1 ${
                              todo.completed ? "line-through text-stone-500" : ""
                            }`}>
                              {todo.text}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTodo(todo.id)}
                            className="p-1 hover:text-red-400 text-stone-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleAddTodo} className="flex gap-2">
                      <input
                        value={newTodoText}
                        onChange={(e) => setNewTodoText(e.target.value)}
                        placeholder="Add checklist task (e.g., Get fresh eggs)..."
                        className="flex-1 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white px-3 py-2.5 outline-none"
                        type="text"
                      />
                      <button
                        type="submit"
                        className="bg-amber-500 text-stone-950 px-3 py-2 rounded-xl text-xs font-black"
                      >
                        Add to List
                      </button>
                    </form>
                  </div>

                  {/* Bookmark Favorites shortcut link boxes */}
                  <div className="mt-6 space-y-3 shrink-0">
                    <h4 className="text-xs uppercase font-black tracking-wider text-stone-400 border-b border-stone-850 pb-1.5 flex items-center justify-between">
                      <span>Starred Starred Bookmarks ({favorites.size})</span>
                      <span className="text-[10px] text-stone-500 font-bold font-mono">BVS Guide</span>
                    </h4>

                    {favorites.size === 0 ? (
                      <p className="text-[10px] text-stone-500 italic py-2">
                        No bookmarked farm stands. Click the hearts on the stands list to save your favorites here!
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 gap-2">
                        {stands.filter(s => favorites.has(s.id)).map(s => (
                          <div 
                            key={s.id} 
                            onClick={() => {
                              setActiveStandId(s.id);
                              setActiveTab("map");
                            }}
                            className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between cursor-pointer hover:border-amber-500/20 transition"
                          >
                            <div>
                              <div className="text-[9px] uppercase font-bold text-stone-400 capitalize">{s.town}</div>
                              <div className="text-xs font-black text-white">{s.name}</div>
                              <div className="text-[9.5px] text-stone-400 italic mt-0.5">Hours: {s.hours}</div>
                            </div>
                            <span className="bg-stone-950 text-stone-400 px-2.5 py-1 rounded-lg text-[9px] hover:text-white font-extrabold flex items-center gap-0.5 border border-stone-850 whitespace-nowrap">
                              📌 Show Pin
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Adding custom Neighbor Stand form */}
                  <div className="mt-6 pb-12">
                    <button
                      type="button"
                      onClick={() => setShowAddStandForm(!showAddStandForm)}
                      className="w-full border border-dashed border-stone-800 bg-stone-900/30 p-4 rounded-2xl text-center text-xs font-extrabold text-stone-400 hover:text-white hover:border-stone-700 transition"
                    >
                      {showAddStandForm ? "✕ Hide Form Block" : "➕ Share & Custom-Map Your Own Backyard Stand!"}
                    </button>

                    {showAddStandForm && (
                      <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        onSubmit={handleCreateStand}
                        className="bg-stone-900 border border-stone-800 rounded-2xl p-4.5 space-y-4 mt-3"
                      >
                        <div className="border-b border-stone-850 pb-2">
                          <h4 className="text-xs font-black text-white">Coordinate custom stand placement data</h4>
                          <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">
                            Place your private garden pin on our Tehachapi valley coordinates grid.
                          </p>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] uppercase font-black text-stone-400">Backyard Name *</label>
                          <input
                            required
                            placeholder="E.g., Oak Meadow Fresh Cucumbers"
                            value={newStandName}
                            onChange={(e) => setNewStandName(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-xl text-xs text-white px-3 py-2.5 outline-none"
                            type="text"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] uppercase font-black text-stone-400">Street Address *</label>
                          <input
                            required
                            placeholder="E.g., 29124 Country Oaks Dr."
                            value={newStandAddress}
                            onChange={(e) => setNewStandAddress(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-xl text-xs text-white px-3 py-2.5 outline-none"
                            type="text"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9.5px] uppercase font-black text-stone-400">Area Town *</label>
                            <select
                              value={newStandTown}
                              onChange={(e) => setNewStandTown(e.target.value as any)}
                              className="w-full bg-stone-950 text-white rounded-xl px-2 py-2.5 text-xs font-black border border-stone-850 cursor-pointer outline-none"
                            >
                              <option value="Bear Valley Springs">Bear Valley Springs</option>
                              <option value="Stallion Springs">Stallion Springs</option>
                              <option value="Golden Hills">Golden Hills</option>
                              <option value="Tehachapi Town">Tehachapi Town</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9.5px] uppercase font-black text-stone-400">Dial Phone</label>
                            <input
                              placeholder="(661) 555-0100"
                              value={newStandPhone}
                              onChange={(e) => setNewStandPhone(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-850 rounded-xl text-xs text-white px-3 py-2.5 outline-none"
                              type="text"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9.5px] uppercase font-black text-stone-400">Map Horizon-X ({newStandX}%)</label>
                            <input
                              type="range"
                              min={5}
                              max={95}
                              value={newStandX}
                              onChange={(e) => setNewStandX(Number(e.target.value))}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9.5px] uppercase font-black text-stone-400">Map Horizon-Y ({newStandY}%)</label>
                            <input
                              type="range"
                              min={5}
                              max={95}
                              value={newStandY}
                              onChange={(e) => setNewStandY(Number(e.target.value))}
                              className="w-full accent-amber-500 cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] uppercase font-black text-stone-400">Hours *</label>
                          <input
                            required
                            placeholder="E.g., Weekends: Dawn to sold out"
                            value={newStandHours}
                            onChange={(e) => setNewStandHours(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-xl text-xs text-white px-3 py-2.5 outline-none"
                            type="text"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] uppercase font-black text-stone-400">Offerings Tags</label>
                          <div className="flex gap-2">
                            <input
                              placeholder="E.g., fresh cider, pumpkin"
                              value={customOfferingTag}
                              onChange={(e) => setCustomOfferingTag(e.target.value)}
                              className="flex-1 bg-stone-950 border border-stone-850 rounded-xl text-xs text-white px-3 py-2 outline-none"
                              type="text"
                            />
                            <button
                              type="button"
                              onClick={handleAddOfferingTag}
                              className="bg-stone-800 text-stone-200 text-xs px-3 rounded-xl hover:bg-stone-750 transition font-bold"
                            >
                              Add Offer
                            </button>
                          </div>
                          {newStandOfferings.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1.5">
                              {newStandOfferings.map((tag) => (
                                <span key={tag} className="bg-stone-950 text-stone-300 border border-stone-850 px-2 py-0.5 rounded text-[8px] font-black flex items-center gap-0.5">
                                  {tag}
                                  <button onClick={() => setNewStandOfferings(newStandOfferings.filter(x => x !== tag))} className="text-[8px] text-red-400 ml-1">x</button>
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9.5px] uppercase font-black text-stone-400">Short Story</label>
                          <textarea
                            placeholder="Introduce your homestead flowers, family history, eggs or organic soil setups..."
                            rows={2}
                            value={newStandDescription}
                            onChange={(e) => setNewStandDescription(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-850 rounded-xl text-xs text-white px-3 py-2 outline-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-xs rounded-xl shadow border border-amber-400 transition"
                        >
                          Submit Homestead & Map Placement
                        </button>
                      </motion.form>
                    )}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Simulated iOS Phone Call Overlay Drawer */}
          <AnimatePresence>
            {callingStand && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-950/90 flex flex-col justify-between items-center py-16 px-6 z-50 text-center select-none"
              >
                <div className="space-y-2 mt-8">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-mono">Simulated Dialer</span>
                  <div className="w-20 h-20 bg-stone-800 rounded-full mx-auto flex items-center justify-center text-5xl border border-stone-700 shadow-xl">
                    📞
                  </div>
                  <h3 className="text-xl font-black text-white">{callingStand.name}</h3>
                  <p className="text-xs text-stone-400 font-bold tracking-wide">
                    {callingStand.phone}
                  </p>
                  <p className="text-[10.5px] text-stone-500 max-w-xs mx-auto italic mt-4 leading-normal">
                    "Thanks for calling the {callingStand.name} stand! Leave a text message or join us in-person if we are down in the orchards!"
                  </p>
                </div>

                <div className="space-y-4 w-full max-w-xs mb-8">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-black animate-pulse">
                    <span>🟢 Calling... (Simulated connection ok)</span>
                  </div>
                  <button
                    onClick={() => setCallingStand(null)}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition"
                  >
                    End Simulated Call
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Native-style Mobile Tab Navigation Footer */}
          <div className="bg-stone-950 h-16 border-t border-stone-850 flex items-center justify-around shrink-0 px-2">
            <button
              onClick={() => setActiveTab("map")}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition ${
                activeTab === "map" ? "text-amber-500" : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <Map className="w-4.5 h-4.5" />
              <span className="text-[10px] font-black tracking-tight select-none">GPS Map</span>
            </button>

            <button
              id="browse-tab-trigger"
              onClick={() => setActiveTab("browse")}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition ${
                activeTab === "browse" ? "text-amber-500" : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span className="text-[10px] font-black tracking-tight select-none">Stands</span>
            </button>

            <button
              onClick={() => setActiveTab("chef")}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition ${
                activeTab === "chef" ? "text-amber-500" : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <Sparkles className="w-4.5 h-4.5" />
              <span className="text-[10px] font-black tracking-tight select-none font-gaegu text-xs">AI CowboyChef</span>
            </button>

            <button
              onClick={() => setActiveTab("basket")}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 relative transition ${
                activeTab === "basket" ? "text-amber-500" : "text-stone-500 hover:text-stone-300"
              }`}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              <span className="text-[10px] font-black tracking-tight select-none">My Basket</span>
              {favorites.size > 0 && (
                <span className="absolute right-4.5 top-1.5 bg-amber-500 text-stone-950 font-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.size}
                </span>
              )}
            </button>
          </div>

        </div>
      </DeviceFrame>

      {/* Symmetrical simple small indicator on bottom */}
      <div className="text-center text-stone-600 text-[10px] mb-2 shrink-0 select-none">
        Simulated using Google AI Studio Build Node Platform. Time: UTC 2026.
      </div>

    </div>
  );
}
