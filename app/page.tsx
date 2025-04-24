'use client';

import { useEffect, useState } from 'react';
import InventoryTable from '@/components/InventoryTable';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <main className="p-6 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Baaz Inventory</h1>
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="bg-gray-200 cursor-pointer dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded shadow"
        >
          {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>
      <InventoryTable />
    </main>
  );
}
