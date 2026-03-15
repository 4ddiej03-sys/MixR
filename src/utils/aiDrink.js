// utils/aiDrink.js — AI drink generation from shelf items
import { callAI } from "./callAI";

export async function generateAIDrink(shelfItems, preferences = {}) {
  const items = shelfItems.map(i => typeof i === "object" ? i.name : i).join(", ");
  const { alcoholic = "any", category = "any", occasion = "" } = preferences;

  const prompt = `You are a world-class bartender and mixologist with knowledge of drinks from every culture worldwide.

The user has these items on their shelf: ${items}

Preferences:
- Alcoholic: ${alcoholic}
- Category: ${category}
- Occasion: ${occasion || "any"}

Create 3 unique drink recipes using ONLY what they have. Include cocktails, mocktails, traditional drinks, shots, wine-based drinks, beer cocktails — whatever fits best.

For each drink include global and traditional options where relevant (e.g. Malaysian teh tarik, Japanese sake cocktail, Filipino lambanog drink, Māori kawakawa).

Reply ONLY with valid JSON (no markdown):
{
  "drinks": [
    {
      "id": "unique-id",
      "title": "Drink Name",
      "category": "Cocktail/Mocktail/Traditional/Shot/Wine/Beer",
      "origin": "Country of origin",
      "difficulty": "Easy/Medium/Hard",
      "prepTime": "X mins",
      "servings": 1,
      "alcoholic": true/false,
      "description": "One sentence description",
      "ingredients": ["60ml vodka", "30ml lime juice"],
      "steps": ["Step 1", "Step 2"],
      "tags": ["tag1", "tag2"],
      "glassware": "Type of glass",
      "garnish": "Garnish suggestion"
    }
  ]
}`;

  const result = await callAI(prompt, 2000);
  if (!Array.isArray(result.drinks)) throw new Error("Invalid AI response");
  return result.drinks.map(d => ({ ...d, id: d.id || crypto.randomUUID(), generated: true }));
}
