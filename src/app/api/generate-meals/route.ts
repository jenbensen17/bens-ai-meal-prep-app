import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    const { goal, calories, budget, stores, selectedDays, mealPlan } = await req.json();

    const prompt = `
    Generate a meal plan with the following configuration:

- Goal: ${goal}
- Calories per day: ${calories}
- Budget: $${budget}
- Preferred stores: ${stores.join(', ')}
- Days to plan for: ${selectedDays.join(', ')}
- For each meal type:
  - Breakfast: ${mealPlan.breakfast.count} meals, ${mealPlan.breakfast.servings} servings each
  - Lunch: ${mealPlan.lunch.count} meals, ${mealPlan.lunch.servings} servings each
  - Dinner: ${mealPlan.dinner.count} meals, ${mealPlan.dinner.servings} servings each
If it is not possible to meet the budget with the given meal plan, simply return "NOT POSSIBLE". DO NOT CONTINUE GENERATING.
Clearly format the output by meal and day. Each meal should include ingredients and prep instructions.

    `;
    

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ mealPlan: text });
}
