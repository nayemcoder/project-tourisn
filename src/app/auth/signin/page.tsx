// src/app/auth/signin/page.tsx
'use client';

import { useState, useEffect }        from 'react';
import { useRouter }                  from 'next/navigation';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';

export default function SignInPage() {
  const supabase = useSupabaseClient();
  const session  = useSession();
  const router   = useRouter();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  // If already signed in, go to dashboard
  useEffect(() => {
    if (session) router.replace('/dashboard');
  }, [session, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    router.replace('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h2 className="text-2xl font-semibold mb-6">Sign In</h2>
      <form onSubmit={handleSignIn} className="space-y-4">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Signing In…' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}