'use client';

import Link from 'next/link';
import { useState } from 'react';

const TRIP_TYPES = [
  { id: 'oneway', label: 'One Way' },
  { id: 'roundtrip', label: 'Round Trip' },
  { id: 'multicity', label: 'Multi City' },
];

export default function HomePage() {
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip' | 'multicity'>('oneway');
  const [from, setFrom] = useState('Dhaka (DAC)');
  const [to, setTo] = useState("Cox's Bazar (CXB)");
  const [departDate, setDepartDate] = useState('2025-09-10');
  const [returnDate, setReturnDate] = useState('2025-09-15');
  const [travelers, setTravelers] = useState(1);
  const [travelClass, setTravelClass] = useState('Economy');

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      tripType,
      from,
      to,
      departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : null,
      travelers,
      travelClass,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Search Form */}
      <div className="flex justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl bg-white/90 p-6 rounded-lg shadow-lg space-y-4"
        >
          {/* Trip Type */}
          <div className="flex space-x-2">
            {TRIP_TYPES.map((opt) => (
              <label
                key={opt.id}
                className={`flex-1 text-center py-2 rounded font-medium cursor-pointer ${
                  tripType === opt.id
                    ? 'bg-blue-800 text-white'
                    : 'bg-blue-300 text-black'
                }`}
              >
                <input
                  type="radio"
                  name="tripType"
                  value={opt.id}
                  checked={tripType === opt.id}
                  onChange={() => setTripType(opt.id as any)}
                  className="hidden"
                />
                {opt.label}
              </label>
            ))}
          </div>

          {/* From / To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup label="From" value={from} onChange={setFrom} />
            <InputGroup label="To" value={to} onChange={setTo} />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DateGroup
              label="Departure"
              value={departDate}
              onChange={setDepartDate}
              min={today}
            />
            {tripType === 'roundtrip' && (
              <DateGroup
                label="Return"
                value={returnDate}
                onChange={setReturnDate}
                min={departDate}
              />
            )}
          </div>

          {/* Travelers & Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectGroup
              label="Traveler"
              value={String(travelers)}
              onChange={(v) => setTravelers(Number(v))}
              options={Array.from({ length: 5 }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1} ${i === 0 ? 'Traveler' : 'Travelers'}`,
              }))}
            />
            <SelectGroup
              label="Class"
              value={travelClass}
              onChange={setTravelClass}
              options={[
                { value: 'Economy', label: 'Economy' },
                { value: 'Business', label: 'Business' },
                { value: 'First Class', label: 'First Class' },
              ]}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-400 text-black font-bold rounded hover:bg-blue-500 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* BELOW THE HERO */}
      <main className="py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          <h2 className="text-3xl font-bold text-center text-blue-100">
            Why Choose Tourisn?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" >
            <div className='bg-blue-200 rounded-lg shadow-lg'>
            <FeatureCard
              title="Easy Booking"
              description="Find & book flights, hotels, tours, visas—all in one place."
              href="/tours"
            />

            </div>
           <div className='bg-blue-200 rounded-lg shadow-lg'>
           <FeatureCard
              title="Become a Guide"
              description="Share your expertise & earn by hosting tours."
              href="/auth/signup?role=local_guide"
            />
           </div>

           <div className='bg-blue-200 rounded-lg shadow-lg'>
           <FeatureCard
              title="Grow Your Business"
              description="Manage listings, track bookings, boost revenue."
              href="/auth/signup?role=business_owner"
            />
           </div>
           
           
          </div>
        </div>
      </main>
    </div>
  );
}

/* Reusable Components */
function InputGroup({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-900 placeholder-gray-500"
      />
    </div>
  );
}

function DateGroup({
  label,
  value,
  onChange,
  min,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: string;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label} Date</label>
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-900 placeholder-gray-500"
      />
    </div>
  );
}

function SelectGroup({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded-md text-gray-900"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
    >
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
}