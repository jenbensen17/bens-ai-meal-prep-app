'use client';

import { useState } from 'react';

const stores = ['Trader Joe\'s', 'Whole Foods', 'Walmart', 'Costco', 'Smith\'s'];
const mealOptions = ['breakfast', 'lunch', 'dinner'] as const;


const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];


export default function PreferencesPage() {
    const [goal, setGoal] = useState('maintain');
    const [calories, setCalories] = useState(2200);
    const [budget, setBudget] = useState(50);
    const [storePrefs, setStorePrefs] = useState<string[]>([]);
    const [mealPlan, setMealPlan] = useState({
        breakfast: { count: 0, servings: 1 },
        lunch: { count: 5, servings: 1 },
        dinner: { count: 5, servings: 1 },
    });

    const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    const [loading, setLoading] = useState(false);


    const toggle = (value: string, array: string[], setArray: (val: string[]) => void) => {
        setArray(array.includes(value) ? array.filter((v) => v !== value) : [...array, value]);
    };

    const handleMealChange = (meal: keyof typeof mealPlan, field: 'count' | 'servings', value: number) => {
        setMealPlan((prev) => ({
            ...prev,
            [meal]: {
                ...prev[meal],
                [field]: value,
            },
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            goal,
            calories,
            budget,
            stores: storePrefs,
            selectedDays,
            mealPlan,
        };

        try {
            const res = await fetch('/api/generate-meals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            console.log('Meal Plan:', result);
            localStorage.setItem('mealPlan', JSON.stringify(result));

            window.location.href = '/dashboard';
        } catch (err) {
            console.error('Error generating meal plan:', err);
            alert('Something went wrong. Try again.');
        } finally {
            setLoading(false);
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
                    {/* Preferred Stores */}
                    <div>
                        <label className="block font-semibold mb-2">Preferred Stores</label>
                        <div className="flex flex-wrap gap-2">
                            {stores.map((store) => (
                                <button
                                    type="button"
                                    key={store}
                                    onClick={() => toggle(store, storePrefs, setStorePrefs)}
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


                    <div>
                        <label className="block font-semibold mb-2">Select Days to Plan</label>
                        <div className="flex flex-wrap gap-2">
                            {daysOfWeek.map((day) => (
                                <button
                                    type="button"
                                    key={day}
                                    onClick={() => toggle(day, selectedDays, setSelectedDays)}
                                    className={`px-4 py-2 rounded-full border-2 transition-all font-medium
                                    ${selectedDays.includes(day)
                                            ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                                            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'}
                                    `}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* Days */}
                    <div>
                        <label className="block font-semibold mb-2 text-white">Meals & Servings Per Week</label>
                        <div className="grid grid-cols-3 gap-4">
                            {mealOptions.map((meal) => (
                                <div key={meal} className="space-y-2">
                                    <div className="text-white font-medium capitalize">{meal}</div>
                                    <div className="text-sm text-gray-400"># of meals</div>
                                    <input
                                        type="number"
                                        min={0}
                                        max={21}
                                        value={mealPlan[meal].count}
                                        onChange={(e) => handleMealChange(meal, 'count', Number(e.target.value))}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                                    />
                                    <div className="text-sm text-gray-400">Servings per meal</div>
                                    <input
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={mealPlan[meal].servings}
                                        onChange={(e) => handleMealChange(meal, 'servings', Number(e.target.value))}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl text-lg font-semibold transition-all shadow-md ${loading
                            ? 'bg-blue-800 cursor-not-allowed text-gray-300'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {loading ? '🍳 Generating Meal Plan...' : '🍽️ Generate Meal Plan'}
                    </button>

                </form>
            </div>
        </main>
    )
}
