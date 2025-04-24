'use client';

import { useState } from 'react';

const stores = ['Trader Joe\'s', 'Whole Foods', 'Walmart', 'Costco', 'Safeway'];

export default function PreferencesPage() {
    const [goal, setGoal] = useState('maintain');
    const [calories, setCalories] = useState(2200);
    const [budget, setBudget] = useState(50);
    const [storePrefs, setStorePrefs] = useState<string[]>([]);

    const toggleStore = (store: string) => {
        setStorePrefs((prev) => prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            goal,
            calories,
            budget,
            stores: storePrefs
        };

        console.log('Form submitted:', data);
        try {
            const res = await fetch('/api/generate-meals', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
        
            const result = await res.json();
            console.log('Generated meal plan:', result.mealPlan);
        
            // For now, just show the result in an alert or log
            alert(result.mealPlan); // Optional: Temporary visual feedback
        
            // TODO: Route to dashboard and pass result
          } catch (err) {
            console.error('Failed to generate meal plan:', err);
          }
    };
    return (
        <main className="min-h-screen flex justify-center px-4">
            <div className="w-full max-w-xl space-y-8">
                <h1 className="text-3xl font-bold text-center">Create Your Meal Plan</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-semibold mb-1">Fitness Goal</label>
                        <select
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full border rounded p-2 font-medium bg-white text-gray-800"
                        >
                            <option value="cut">🔥 Cut (fat loss)</option>
                            <option value="bulk">🍗 Bulk (muscle gain)</option>
                            <option value="maintain">⚖️ Maintain</option>
                        </select>


                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Calorie Target</label>
                        <input
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(Number(e.target.value))}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Weekly Budget ($)</label>
                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold mb-2">Preferred Stores</label>
                        <div className="flex flex-wrap gap-2">
                            {stores.map((store) => (
                                <button
                                    type="button"
                                    key={store}
                                    onClick={() => toggleStore(store)}
                                    className={`px-4 py-2 rounded-full border-2 transition-all font-medium
                  ${storePrefs.includes(store)
                                            ? 'bg-green-600 text-white border-green-700 shadow-sm'
                                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}
                `}
                                >
                                    {store}
                                </button>

                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all shadow-md"
                    >
                        🍽️ Generate Meal Plan
                    </button>
                </form>
            </div>
        </main>
    )
}
