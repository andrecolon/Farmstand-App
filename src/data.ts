/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FarmStand, Review, StockReport, UserLocation } from "./types";

export const INITIAL_STANDS: FarmStand[] = [
  {
    id: 1,
    name: "A-Frame Bakery",
    address: "22451 Hillside Ct",
    town: "Bear Valley Springs",
    offerings: ["Baguettes", "Coffee", "Baked Goods", "Sourdough", "Muffins"],
    markerClass: "marker-1",
    x: 28,
    y: 36,
    image: "bakery-cozy",
    hours: "Thursday – Sunday: 8 AM – 12 PM",
    phone: "(661) 555-0142",
    rating: 4.9,
    description: "Nestled in BVS, a charming A-frame cabin baking slow-fermented crusty baguettes and fresh drip mountain coffee."
  },
  {
    id: 2,
    name: "Alligator Rose",
    address: "27650 Buckpasser Dr.",
    town: "Stallion Springs",
    offerings: ["Tallow", "Clay Soap", "Body Care", "Pottery", "Gifts"],
    markerClass: "marker-2",
    x: 42,
    y: 78,
    image: "apothecary-rustic",
    hours: "Fridays: 10 AM – 4 PM & weekends",
    phone: "(661) 555-0158",
    rating: 4.8,
    description: "Your local source for skin-loving grass-fed tallow whip, custom clay soaps, rustic handmade pottery, and thoughtful country gifts."
  },
  {
    id: 3,
    name: "Bear Valley Springs Farmstand",
    address: "30040 Pinedale Drive",
    town: "Bear Valley Springs",
    offerings: ["Flowers", "Veggies", "Fruit", "Eggs", "Local Honey"],
    markerClass: "marker-3",
    x: 14,
    y: 21,
    image: "flower-stand",
    hours: "Saturdays: 9 AM – 2 PM (Seasonal)",
    phone: "(661) 555-0112",
    rating: 4.7,
    description: "A gorgeous roadside table featuring blooming fresh-cut dahlias, sweet snap peas, pasture eggs, and mountain honey."
  },
  {
    id: 4,
    name: "Flow & Dough Bakery & Bread",
    address: "29312 Fawn Way",
    town: "Bear Valley Springs",
    offerings: ["Baked Goods", "Cinnamon Rolls", "Focaccia", "Cookies"],
    markerClass: "marker-4",
    x: 30,
    y: 17,
    image: "pastry-sweet",
    hours: "Saturday morning only: 7:30 AM until sold out",
    phone: "(661) 555-0133",
    rating: 5.0,
    description: "Run by home bakers with a passion for ultra-soft, warm cinnamon rolls, garlic focaccia loaves, and melt-in-your-mouth country cookies."
  },
  {
    id: 5,
    name: "Irie Family Farms",
    address: "21801 Old Town Road",
    town: "Golden Hills",
    offerings: ["Chicken Eggs", "Duck Eggs", "Microgreens", "Herbs"],
    markerClass: "marker-5",
    x: 66,
    y: 37,
    image: "poultry-nest",
    hours: "Self-service: Open daily from Dawn to Dusk",
    phone: "(661) 555-0199",
    rating: 4.6,
    description: "A lovely self-serve honor stand specializing in rich, golden-yolk chicken eggs, nutrient-dense duck eggs, and super fresh greenhouse microgreens."
  },
  {
    id: 6,
    name: "Old Town Road Farmstand",
    address: "20983 Old Town Rd.",
    town: "Stallion Springs",
    offerings: ["Veggies", "Preserves", "Artisanal Vinegar", "Country Butter"],
    markerClass: "marker-6",
    x: 76,
    y: 43,
    image: "veggie-crate",
    hours: "Wednesday & Saturday: 9 AM – 3 PM",
    phone: "(661) 555-0176",
    rating: 4.5,
    description: "A wonderful mountain crossroads stand offering slow-boiled sweet jams, pickling jars, homemade fruit vinegars, and fresh block butter."
  },
  {
    id: 7,
    name: "The Hayek Homestead",
    address: "30731 Buckskin Dr",
    town: "Stallion Springs",
    offerings: ["Sourdough", "Baked Goods", "Pickles", "Eggs", "Fruit", "Veggies"],
    markerClass: "marker-7",
    x: 18,
    y: 72,
    image: "homesteader",
    hours: "Thursday – Saturday: 9 AM – 5 PM",
    phone: "(661) 555-0187",
    rating: 4.9,
    description: "A beautiful self-sustaining family homestead showcasing country pickles, sourdough loaves, pasture eggs, and fresh-picked orchard fruit."
  },
  {
    id: 8,
    name: "The Silva Family Farm",
    address: "17741 Churchill St.",
    town: "Stallion Springs",
    offerings: ["Sourdough", "English Muffins", "Pizza Crust", "Baked Goods", "Garlic Jam"],
    markerClass: "marker-8",
    x: 46,
    y: 86,
    image: "baker-grain",
    hours: "Thursdays: 12 PM – 5 PM & weekends",
    phone: "(661) 555-0128",
    rating: 4.8,
    description: "Known throughout Stallion for the absolute ultimate English muffins, pre-stretched artisan pizza crust, and unique black garlic honey jam."
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    farmId: 1,
    userName: "Cassie Cooper",
    rating: 5,
    comment: "The baguettes are crisp outside and so light inside! Definitely arrive by 8:30 before the morning hikers buy everything up.",
    date: "Jun 03, 2026"
  },
  {
    id: "rev-2",
    farmId: 4,
    userName: "Dustin M.",
    rating: 5,
    comment: "Literally the softest, most buttery cinnamon rolls I have ever tasted. Maverick’s coffee paired with a fresh-baked roll is the ultimate Saturday morning ritual.",
    date: "May 28, 2026"
  },
  {
    id: "rev-3",
    farmId: 7,
    userName: "Meredith S.",
    rating: 5,
    comment: "Excellent homestead. The pickles are so crispy and tanginess is just right! The kids love picking out our weekly eggs from their beautiful nesting coop cabinet.",
    date: "May 15, 2026"
  },
  {
    id: "rev-4",
    farmId: 2,
    userName: "Jackson Ford",
    rating: 4,
    comment: "The tallow face whip has cleared my dry skin wonderfully. Beautiful hand-thrown mugs too, picked up one for my coffee.",
    date: "Jun 01, 2026"
  },
  {
    id: "rev-5",
    farmId: 5,
    userName: "Becca Vance",
    rating: 5,
    comment: "Super reliable self-serve system! Sells great big duck eggs that are perfect for my gluten-free baking projects.",
    date: "May 29, 2026"
  }
];

export const INITIAL_REPORTS: StockReport[] = [
  {
    id: "rep-1",
    farmId: 1,
    item: "Baguettes",
    status: "in_stock",
    reportedBy: "SourdoughSam",
    timestamp: "15 mins ago"
  },
  {
    id: "rep-2",
    farmId: 3,
    item: "Pasture Eggs",
    status: "low_stock",
    reportedBy: "MountainBiker99",
    timestamp: "1 hour ago"
  },
  {
    id: "rep-3",
    farmId: 5,
    item: "Duck Eggs",
    status: "in_stock",
    reportedBy: "GraceH",
    timestamp: "32 mins ago"
  },
  {
    id: "rep-4",
    farmId: 7,
    item: "Sourdough Loaves",
    status: "out_of_stock",
    reportedBy: "TehachapiMama",
    timestamp: "2 hours ago"
  }
];

export const SIMULATED_SITES: UserLocation[] = [
  { name: "My Mountain Home (BVS)", x: 20, y: 30 },
  { name: "Stallion Springs Lodge", x: 30, y: 80 },
  { name: "Tehachapi Town Center", x: 60, y: 55 },
  { name: "Golden Hills Park", x: 68, y: 32 }
];
