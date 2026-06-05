/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely if the key exists
let aiClient: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

function getGemini(): GoogleGenAI | null {
  if (!aiClient && apiKey) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// 1. API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", hasApiKey: !!apiKey });
});

// 2. API: Farm Stand AI Chef Recipe Generator
app.post("/api/chef/recipe", async (req, res) => {
  const { ingredients = [], standName = "Tehachapi Stand", dietary = "" } = req.body;

  if (!ingredients.length) {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  const ingredientList = ingredients.join(", ");
  const systemPrompt = `You are "Maverick", the friendly local Tehachapi Farm Stand head chef. 
You live in the beautiful, rural mountain town of Tehachapi, California.
You talk in a warm, rustic, and highly encouraging tone, like a loving neighbor who runs a farm booth.
Your goal is to take a list of local farm ingredients and craft an absolute masterclass of a cozy country recipe.
Ensure the recipe sounds mouthwatering, healthy, and easy to cook in a wood stove or country kitchen.
Reference the beautiful mountain air of Tehachapi / Stallion Springs and the farm stand they purchased it from: "${standName}".`;

  const prompt = `Please create a country-style recipe.
Available Ingredients: ${ingredientList}
Dietary Restrictions / Preferences: ${dietary || "None"}
Farm Stand Source: ${standName}

Return a detailed recipe structured strictly in JSON format matching the schema rules requested.`;

  try {
    const aiInstance = getGemini();

    if (!aiInstance) {
      throw new Error("No Gemini API key configured. Running in local fallback mode.");
    }

    const response = await aiInstance.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Uniquely comforting and rustic name of the recipe." },
            description: { type: Type.STRING, description: "A highly welcoming, delicious 2-sentence story or description of the dish." },
            prepTime: { type: Type.STRING, description: "Prep time (e.g. '15 mins')" },
            cookTime: { type: Type.STRING, description: "Cook time (e.g. '25 mins')" },
            servings: { type: Type.STRING, description: "Number of servings (e.g. '4 servings')" },
            ingredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of ingredients with rustic measurements (e.g., '1 cup pasture eggs', 'A pinch of fresh handpicked sage')."
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Stagewise instructions explaining how to prepare. Incorporate warm, cozy language."
            },
            chefTips: { type: Type.STRING, description: "Chef Maverick's extra-special mountain tip (e.g., 'Serve this with a dollop of honey in BVS mountain air!')." },
          },
          required: ["title", "description", "prepTime", "cookTime", "servings", "ingredients", "steps", "chefTips"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from AI model");
    }

    const recipeData = JSON.parse(responseText.trim());
    return res.json(recipeData);

  } catch (error: any) {
    console.warn("Gemini Recipe generation failed or key was missing. Serving beautiful fallback recipe:", error.message);
    
    // Fallback Recipe Engine
    const isEggs = ingredients.some((i: string) => i.toLowerCase().includes("egg"));
    const isBread = ingredients.some((i: string) => i.toLowerCase().includes("sourdough") || i.toLowerCase().includes("baguette") || i.toLowerCase().includes("bake"));
    const isVeggies = ingredients.some((i: string) => i.toLowerCase().includes("veggie") || i.toLowerCase().includes("fruit") || i.toLowerCase().includes("apple"));

    let fallbackRecipe = {
      title: "Maverick's Tehachapi Trailside Scramble",
      description: "A quick, nourishing skillet breakfast inspired by crisp Stallion Springs mornings. Loaded with pasture-fresh ingredients and perfect with clean mountain air.",
      prepTime: "10 mins",
      cookTime: "10 mins",
      servings: "2 hungry campers",
      ingredients: [
        "4 fresh farm eggs (shaken from local nest)",
        "1 cup seasonal chopped garden veggies",
        "2 thick slices of artisanal Sourdough bread",
        "1 tbsp home-churned farm butter",
        "A pinch of sea salt & crushed pepper",
        "A splash of local honey (optional)"
      ],
      steps: [
        "Warm up your heavy cast-iron skillet over a steady medium flame on your stove.",
        "Melt a large knob of rich farm butter until it starts to bubble and smell like absolute heaven.",
        "Toss in your chopped farm-fresh vegetables and sauté until tender-crisp and fragrant.",
        "In a small earthen bowl, light whisk your pasture eggs with a sprinkle of sea salt.",
        "Pour the eggs into the skillet. Slowly fold in creaminess, letting them scramble gently.",
        "Toast your thick slices of crusty farm bread to a beautiful golden brown.",
        "Spoon the soft scrambles over the toasted bread, slide a drizzle of honey on top, and eat fresh!"
      ],
      chefTips: "For a true Bear Valley Springs experience, enjoy this right on your outdoor deck of a frosty morning and listen to the birds. Keep it rustically simple!"
    };

    if (isBread && !isEggs) {
      fallbackRecipe = {
        title: "Mountain Slices with Honey-Sprinkled Herbs",
        description: "A hearty baked treat celebrating local grains. Slow-fermented bread meets sweet mountain accents for an afternoon pick-me-up.",
        prepTime: "5 mins",
        cookTime: "5 mins",
        servings: "3 friends",
        ingredients: [
          "1 crusty loaf of farm stand sourdough or fresh baguette",
          "3 tbsp local sweet wildflower honey",
          "2 oz creamy artisan cottage cheese or butter",
          "Fresh sprigs of thyme or sage if handy"
        ],
        steps: [
          "Slice the baked loaf into rustic, finger-thick slabs with a serrated knife.",
          "Pop them under the broiler for 2 minutes to create a crisp exterior with a soft, warm center.",
          "Schmear a thick cushion of cool cream cheese or fresh butter on each warm slice.",
          "Drizzle gold honey in zigzags right before tossing micro-herbs over the top."
        ],
        chefTips: "The secret is selecting thick, dense loaves. Leftover artisan bread makes the best French toast you will ever eat, cowboy!"
      };
    } else if (isVeggies && !isEggs) {
      fallbackRecipe = {
        title: "Maverick’s Sage Meadow Veggie Toss",
        description: "A vibrant pan-roasted panoply that celebrates our unique high-desert harvests. Simple, colorful, and packed with sweet farm direct flavor.",
        prepTime: "12 mins",
        cookTime: "15 mins",
        servings: "4 sides",
        ingredients: [
          "3 cups mixed farm stand vegetables (squash, tomatoes, greens)",
          "2 cloves smashed garlic",
          "1 tbsp olive oil",
          "1 tsp dried mountain rosemary"
        ],
        steps: [
          "Chop your vibrant produce into uniform bite-size chunks for even country roasting.",
          "Heat olive oil in your skillet, toss in the garlic until it fills the cabin with aroma.",
          "Add the vegetables, tossing vigorously until they take on a sweet, caramelized edge.",
          "Scatter salt, pepper, and wild rosemary over the skillet. Turn off heat and let steam for 2 minutes."
        ],
        chefTips: "Never over-boil your veggies! Keeping that crunch intact preserves all those rich mountain minerals and raw delicious goodness!"
      };
    }

    // Add notice that safe fallback was used
    return res.json({
      ...fallbackRecipe,
      _note: "Rendered elegant farm stand fallback cuisine. Safe, warm, and zero configuration needed!"
    });
  }
});

// Configure Vite or Serve Static build
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Mount Vite middleware
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on port ${PORT}...`);
  });
}

startServer();
