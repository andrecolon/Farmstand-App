/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FarmStand {
  id: number;
  name: string;
  address: string;
  town: "Bear Valley Springs" | "Stallion Springs" | "Golden Hills" | "Tehachapi Town";
  offerings: string[];
  markerClass: string;
  x: number; // custom SVG map placement coordinate (percent or pixels)
  y: number; // custom SVG map placement coordinate (percent or pixels)
  image: string; // cover photo / illustration identifier
  hours: string;
  phone: string;
  rating: number;
  isCustom?: boolean;
  verified?: boolean;
  description?: string;
}

export interface Review {
  id: string;
  farmId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface StockReport {
  id: string;
  farmId: number;
  item: string;
  status: "in_stock" | "low_stock" | "out_of_stock";
  reportedBy: string;
  timestamp: string;
}

export interface UserLocation {
  name: string;
  x: number; // simulated coordinate
  y: number; // simulated coordinate
}

export interface RecipeRequest {
  ingredients: string[];
  standName?: string;
  dietary?: string;
}

export interface RecipeResponse {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  ingredients: string[];
  steps: string[];
  chefTips: string;
}
