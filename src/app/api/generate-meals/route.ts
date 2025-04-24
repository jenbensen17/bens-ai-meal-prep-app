import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { goal, calories, budget, stores } = await req.json();

  const prompt = `
You are a smart meal prep assistant. Based on the following user preferences, generate a 5-day meal plan with breakfast, lunch, and dinner for each day.

- Goal: ${goal}
- Daily Calorie Target: ${calories}
- Weekly Budget: $${budget}
- Preferred Stores: ${stores.join(', ')}

Return the meal plan clearly formatted.
`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return NextResponse.json({ mealPlan: text });
}
