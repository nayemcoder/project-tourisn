'use client';

import Link from 'next/link';

export default function ConfirmPage() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Account Confirmed</h2>
      <p>Your account has been confirmed successfully.</p>
      <Link href="/auth/signin" className="text-blue-600 underline mt-4 block">
        Sign in
      </Link>
    </div>
  );
}
