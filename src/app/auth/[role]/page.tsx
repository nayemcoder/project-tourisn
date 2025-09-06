'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { role } = useParams(); // dynamic role param
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.replace('/auth/signin');
      return;
    }

    const userRole = session.user.user_metadata?.role;
    if (userRole !== role) {
      router.replace(`/dashboard/${userRole}`);
      return;
    }

    setLoading(false);
  }, [session, role, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/auth/signin');
  };

  if (loading) return <p className="p-4">Loading dashboard…</p>;

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4 capitalize">{role} Dashboard</h1>

      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <p><strong>Email:</strong> {session?.user.email}</p>
        <p><strong>Role:</strong> {session?.user.user_metadata?.role}</p>
        <p><strong>User ID:</strong> {session?.user.id}</p>
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
