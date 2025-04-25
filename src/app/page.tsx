'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-b from-white to-gray-100 text-gray-800">
      <h1 className="text-5xl font-bold text-center mb-6">Ben&apos;s AI Meal Prep Planner</h1>
      <p className="text-lg text-center max-w-2xl mb-8">
        Get personalized weekly meal plans powered by AI — tailored to your fitness goals, schedule, and preferences.
      </p>
      <button
        onClick={() => router.push('/dashboard')}
        className="px-6 py-3 bg-black text-white rounded-2xl text-lg font-semibold shadow-md hover:bg-gray-900 transition-all"
      >
        Generate My Meal Plan
      </button>
    </main>
  );
}
