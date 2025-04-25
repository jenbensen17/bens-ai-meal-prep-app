'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [mealPlan, setMealPlan] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('mealPlan');
    setMealPlan(stored);
  }, []);

  return (
    <main className="min-h-screen text-white p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Your Meal Plan</h1>

      {mealPlan ? (
        <pre className="bg-gray-900 border border-gray-700 rounded-lg p-4 whitespace-pre-wrap">
          {mealPlan}
        </pre>
      ) : (
        <p className="text-gray-400">No meal plan found. Please create one from the <Link href="/preferences" className="hover:text-blue-400 transition underline">Plan Preferences</Link> page.</p>
      )}
    </main>
  );
}
