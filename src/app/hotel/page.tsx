'use client';

import { useState } from 'react';

export default function HotelPage() {
  const [location, setLocation] = useState('Cox’s Bazar, Bangladesh');
  const [checkIn, setCheckIn] = useState('2025-09-11');
  const [checkOut, setCheckOut] = useState('2025-09-12');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [filters, setFilters] = useState<string[]>([]);

  const today = new Date().toISOString().split('T')[0];

  const toggleFilter = (filter: string) => {
    setFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ location, checkIn, checkOut, rooms, guests, filters });
  };

  return (
    <div className="flex flex-col">
      {/* Search Panel */}
      <div className="flex justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl bg-white/90 rounded-lg shadow-lg p-6 space-y-6"
        >
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              CITY / HOTEL / RESORT / AREA
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Dates & Guests */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">CHECK-IN</label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">CHECK-OUT</label>
              <input
                type="date"
                value={checkOut}
                min={checkIn}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">ROOMS & GUESTS</label>
              <input
                type="text"
                value={`${rooms} Room, ${guests} Guests`}
                readOnly
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-900"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 ">
            {['Business', 'Couples', 'Families', 'Friends', 'Solo'].map((f) => (
              <button
                type="button"
                key={f}
                onClick={() => toggleFilter(f)}
                className={`px-4 py-2 rounded-full border ${
                  filters.includes(f)
                    ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-blue-400 text-black font-bold rounded hover:bg-blue-500 transition"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* BELOW THE HERO - Featured Hotels */}
      <main className="py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          <h2 className="text-3xl font-bold text-center text-blue-200">Featured Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden"
              >
                <img
                  src={`/images/hotel-${i}.jpg`}
                  alt={`Hotel ${i}`}
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">Hotel {i}</h3>
                  <p className="text-gray-600">Cox’s Bazar, Bangladesh</p>
                  <p className="mt-2 text-blue-600 font-bold">$120 / night</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}