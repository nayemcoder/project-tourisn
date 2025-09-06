// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter }           from 'next/navigation';
import {
  useSupabaseClient,
  useUser
} from '@supabase/auth-helpers-react';

export default function DashboardPage() {
  const supabase = useSupabaseClient();
  const user     = useUser();
  const router   = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) Protect route
    if (!user) {
      router.replace('/auth/signin');
      return;
    }

    // 2) Fetch the role
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: string }>()
      .then(({ data, error }) => {
        if (error || !data?.role) {
          console.error('Error fetching role:', error);
        } else {
          // 3) Redirect by role
          router.replace(`/dashboard/${data.role}`);
        }
      })
      .catch(err => {
        console.error('Unexpected error:', err);
      })
      .then(() => {
        // 4) Always clear loading
        setLoading(false);
      });
  }, [user, router, supabase]);

  if (loading) {
    return <p className="p-8 text-center">Loading your dashboard…</p>;
  }

  return null;
}