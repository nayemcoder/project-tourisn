// src/app/auth/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ROLES = ['traveler', 'local_guide', 'business_owner', 'admin'] as const;

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<typeof ROLES[number]>('traveler');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          full_name: fullName,
          email,
          password,
          role,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? 'Signup failed');
        setLoading(false);
        return;
      }

      // ✅ Immediately redirect to sign-in
      router.push('/auth/signin');
    } catch (err: any) {
      setError(err.message ?? 'Unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          required
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value as typeof ROLES[number])}
          className="w-full p-2 border rounded"
        >
          {ROLES.map(r => (
            <option key={r} value={r}>
              {r.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Creating Account…' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
