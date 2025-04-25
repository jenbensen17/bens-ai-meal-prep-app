import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'AI Meal Planner',
  description: 'Personalized weekly meal plans powered by AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white font-sans">
        <header className="border-b border-gray-800">
          <nav className="max-w-5xl mx-auto flex justify-between items-center py-4 px-6">
            <Link href="/" className="text-2xl font-bold text-blue-400">
              Ben&apos;s AI Meal Planner App
            </Link>
            <div className="flex gap-6 text-gray-300 font-medium">
              <Link href="/preferences" className="hover:text-blue-400 transition">Plan Preferences</Link>
              <Link href="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
            </div>
          </nav>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
