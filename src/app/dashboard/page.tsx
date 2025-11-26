'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export default function DashboardPage() {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        router.replace('/auth/signin');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error || !data?.role) {
          console.error('Error fetching role:', error);
        } else {
          router.replace(`/dashboard/${data.role}`);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user, router, supabase]);

  if (loading) {
    return <p className="p-8 text-center">Loading your dashboard…</p>;
  }

  return null;
}
