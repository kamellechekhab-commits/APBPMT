'use client';

import { useState } from 'react';
import { Component, Category } from '@/types/database';

const categories: { label: string; value: Category }[] = [
  { label: 'CPU', value: 'cpu' },
  { label: 'Motherboard', value: 'motherboard' },
  { label: 'GPU', value: 'gpu' },
  { label: 'RAM', value: 'ram' },
  { label: 'Storage', value: 'storage' },
  { label: 'PSU', value: 'psu' },
  { label: 'Case', value: 'case' },
];

export default function Builder() {
  const [selectedParts, setSelectedParts] = useState<Partial<Record<Category, Component>>>({});

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24">
      <h1 className="text-2xl font-bold mb-6">Build your PC (Algerian Market)</h1>
      
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.value} className="border p-4 rounded-lg flex justify-between items-center bg-white shadow-sm">
            <div>
              <h3 className="font-semibold text-gray-500 uppercase text-xs">{cat.label}</h3>
              <p className="text-lg">
                {selectedParts[cat.value]?.model || `Select ${cat.label}...`}
              </p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
              + Add
            </button>
          </div>
        ))}
      </div>

      {/* Floating Bottom Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-lg lg:max-w-4xl lg:mx-auto">
        <div>
          <p className="text-sm text-gray-500">Total Price</p>
          <p className="text-xl font-bold">0.00 DZD</p>
        </div>
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">
          Save Build
        </button>
      </div>
    </div>
  );
}
