import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    const { goal, calories, budget, stores, selectedDays, mealPlan } = await req.json();

    const prompt = `
You are a meal prep assistant AI. 

Generate a meal plan based on the following inputs:

- Goal: ${goal}
- Calories per day: ${calories}
- Budget: $${budget}
- Preferred stores: ${stores.join(', ')}
- Days to plan: ${selectedDays.join(', ')}
- Meals per week: 
  - Breakfast: ${mealPlan.breakfast.count} meals, ${mealPlan.breakfast.servings} servings each
  - Lunch: ${mealPlan.lunch.count} meals, ${mealPlan.lunch.servings} servings each
  - Dinner: ${mealPlan.dinner.count} meals, ${mealPlan.dinner.servings} servings each

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
      "ingredients": ["2 slices whole grain bread", "1 avocado", "1 egg"],
      "instructions": "Toast the bread, mash the avocado, fry the egg, and assemble."
    },
    ...
  ],
"shoppingList": {
  "Produce": [
    {
      "name": "avocado",
      "quantity": "2",
      "estimatedPrice": "$2.00"
    },
    {
      "name": "spinach",
      "quantity": "5 oz",
      "estimatedPrice": "$3.00"
    }
  ],
  "Meat & Seafood": [
    {
      "name": "chicken breast",
      "quantity": "2 lbs",
      "estimatedPrice": "$7.00"
    }
  ],
  ...
},
"totalEstimatedPrice": {"$50.00"},


}
Return ONLY pure valid JSON. Do NOT include triple backticks or markdown formatting. No extra text or comments.
ENSURE ALL PRODUCE ITEMS ARE AVAILABLE AT THE STORES LISTED. IF POSSIBLE, THE BRAND SHOULD BE SPECIFIED.
`;
    

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text
    .replace(/^```json\n/, '') // remove starting ```json
    .replace(/^```\n/, '')     // just in case no "json" tag
    .replace(/\n```$/, '')     // remove ending ```
    .trim();                   // clean up spaces

  let mealPlanReturn;
  try {
    mealPlanReturn = JSON.parse(cleanedText);
  } catch (error) {
    console.error('Failed to parse Gemini response:', error);
    return NextResponse.json({ error: 'Invalid JSON from Gemini' }, { status: 500 });
  }

  return NextResponse.json(mealPlanReturn, { status: 200 });

}
