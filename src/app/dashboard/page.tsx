'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MealPlan {
  days: {
    [day: string]: {
      breakfast: string | null;
      lunch: string | null;
      dinner: string | null;
    };
  };
  recipes: {
    name: string;
    ingredients: string[];
    instructions: string;
  }[];
  shoppingList: {
    [section: string]: {
      name: string;
      quantity: string;
      estimatedPrice: string;
    }[];
  };
  totalEstimatedPrice: string;
}

export default function Dashboard() {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mealPlan');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMealPlan(parsed);
      } catch (error) {
        console.error('Failed to parse meal plan:', error);
      }
    }
  }, []);
  
  

  if (!mealPlan) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">No Meal Plan Found</h1>
        <p className="text-gray-400">
          Please create a meal plan on the{' '}
          <Link href="/preferences" className="underline hover:text-blue-400 transition">Plan Preferences</Link>{' '}
          page first.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white p-6 max-w-6xl mx-auto space-y-12">
      {/* Weekly Meals */}
      {mealPlan.days && (
        <section>
          <h1 className="text-3xl font-bold text-blue-400 mb-6">📅 Weekly Meals</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(mealPlan.days).map(([day, meals]) => (
              <div key={day} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">{day}</h2>
                {meals.breakfast && <p>🍳 Breakfast: {meals.breakfast}</p>}
                {meals.lunch && <p>🥪 Lunch: {meals.lunch}</p>}
                {meals.dinner && <p>🍽️ Dinner: {meals.dinner}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recipes */}
      {mealPlan.recipes && (
        <section>
          <h1 className="text-3xl font-bold text-blue-400 mb-6">🧑‍🍳 Recipes</h1>
          <div className="space-y-6">
            {mealPlan.recipes.map((recipe) => (
              <div key={recipe.name} className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">{recipe.name}</h2>
                <div className="mb-2">
                  <p className="font-medium">Ingredients:</p>
                  <ul className="list-disc list-inside text-gray-300 ml-4">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Instructions:</p>
                  <p className="text-gray-300 mt-1">{recipe.instructions}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shopping List */}
      {mealPlan.shoppingList && (
        <section>
          <h1 className="text-3xl font-bold text-blue-400 mb-6">🛒 Shopping List</h1>
          <div className="space-y-8">
            {Object.entries(mealPlan.shoppingList).map(([section, items]) => (
              <div key={section}>
                <h2 className="text-xl font-semibold text-white mb-2">{section}</h2>
                <div className="space-y-2">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between bg-gray-900 border border-gray-700 rounded-lg p-3 items-center"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-blue-400 font-semibold">{item.estimatedPrice}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="text-right mt-8 border-t border-gray-700 pt-4">
            <p className="text-xl font-semibold">
              Estimated Total:{' '}
              <span className="text-blue-400">{mealPlan.totalEstimatedPrice}</span>
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
