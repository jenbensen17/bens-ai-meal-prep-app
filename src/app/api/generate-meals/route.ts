import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    const { goal, calories, budget, stores, selectedDays, mealPlan } = await req.json();

    const prompt = `
You are a creative and innovative meal prep assistant AI specializing in diverse, exciting cuisine from around the world. 

Generate a meal plan based on the following inputs:

- Goal: ${goal}
- Calories per day: ${calories}
- Budget: $${budget}
- Preferred stores: ${stores.join(', ')}
- Days to plan: ${selectedDays.join(', ')}
- Meals to generate (GENERATE EXACTLY THIS MANY, NO MORE): 
  - Breakfast: ${mealPlan.breakfast.count} unique meals, ${mealPlan.breakfast.servings} servings each
  - Lunch: ${mealPlan.lunch.count} unique meals, ${mealPlan.lunch.servings} servings each
  - Dinner: ${mealPlan.dinner.count} unique meals, ${mealPlan.dinner.servings} servings each

IMPORTANT GUIDELINES:
1. QUANTITY RULES (STRICT):
   - Generate EXACTLY the number of meals specified above
   - If a meal type count is 0, do not generate any meals of that type
   - Meals can be reused across different days when distributing them in the days object

2. STORE AND PRICING RULES (STRICT):
   - ONLY suggest ingredients available at the specified stores: ${stores.join(', ')}
   - For each ingredient, specify the store-specific brand when possible
   - Use accurate store-specific pricing (e.g., Trader Joe's prices for Trader Joe's items)
   - If an item is significantly cheaper at one of the specified stores, prefer that store
   - For each ingredient, specify which store to buy it from based on:
     * Availability of specific brands
     * Best price for comparable quality
     * Store's typical price point for that category

3. VARIETY IS KEY:
   - Mix different cuisines (Italian, Mexican, Asian, Mediterranean, etc.)
   - Vary cooking methods (grilling, baking, stir-frying, etc.)
   - Balance different protein sources (not just legumes)

4. MEAL QUALITY:
   - Include colorful, seasonal ingredients
   - Mix textures (crunchy, creamy, crispy, etc.)
   - Ensure meals are exciting and restaurant-worthy
   - Consider temperature variety (some meals can be enjoyed cold, others hot)

5. PRACTICALITY:
   - Suggest ingredients that are readily available at the specified stores
   - Consider prep time and complexity
   - Ensure meals stay fresh for the intended meal prep duration
   - Include some quick-to-prepare options

Return ONLY valid JSON formatted exactly like this:

{
  "days": {
    "Monday": {
      "breakfast": "Avocado toast with egg",
      "lunch": "Chicken quinoa bowl",
      "dinner": "Grilled salmon with broccoli"
    },
    ...
  },
  "recipes": [
    {
      "name": "Avocado toast with egg",
      "ingredients": [
        "2 slices Trader Joe's Organic Sourdough Bread",
        "1 large Hass avocado",
        "1 Vital Farms pasture-raised egg"
      ],
      "instructions": "Toast the bread, mash the avocado, fry the egg, and assemble.",
      "prepTime": "10 minutes",
      "cuisine": "Modern American",
      "storageNotes": "Best prepared fresh"
    },
    ...
  ],
"shoppingList": {
  "Produce": [
    {
      "name": "Hass avocado",
      "quantity": "2",
      "estimatedPrice": "$1.49 each",
      "preferredStore": "Trader Joe's",
      "brand": "Organic",
      "notes": "Best price among specified stores"
    },
    {
      "name": "organic baby spinach",
      "quantity": "5 oz",
      "estimatedPrice": "$3.99",
      "preferredStore": "Trader Joe's",
      "brand": "Trader Joe's Organic",
      "notes": "Pre-washed"
    }
  ],
  "Meat & Seafood": [
    {
      "name": "chicken breast",
      "quantity": "2 lbs",
      "estimatedPrice": "$7.99/lb",
      "preferredStore": "Whole Foods",
      "brand": "365 Organic",
      "notes": "Air-chilled, antibiotic-free"
    }
  ],
  ...
},
"totalEstimatedPrice": "$50.00"
}

IMPORTANT: 
1. The recipes array should contain EXACTLY the number of meals specified above (${mealPlan.breakfast.count} breakfast + ${mealPlan.lunch.count} lunch + ${mealPlan.dinner.count} dinner recipes).
2. EVERY ingredient must be available at one of these stores: ${stores.join(', ')}
3. Use accurate store-specific brands and current pricing

Return ONLY pure valid JSON. Do NOT include triple backticks or markdown formatting. No extra text or comments.
`;
    

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
      
        console.log('Gemini raw response:', text);
      
        const cleanedText = text
          .replace(/^```json\n/, '')
          .replace(/^```\n/, '')
          .replace(/\n```$/, '')
          .trim();
      
        const mealPlanReturn = JSON.parse(cleanedText);
        
        return NextResponse.json(mealPlanReturn, { status: 200 });
      
      } catch (error) {
        console.error('Error generating or parsing meal plan:', error);
        return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 });
      }

}
