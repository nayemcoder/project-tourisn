// src/app/layout.tsx
'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  SessionContextProvider,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Database } from '@/lib/database.types';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [supabaseClient] = useState(() =>
    createClientComponentClient<Database>()
  );

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SessionContextProvider supabaseClient={supabaseClient}>
          <RoleBasedLayout>{children}</RoleBasedLayout>
        </SessionContextProvider>
      </body>
    </html>
  );
}

function RoleBasedLayout({ children }: { children: ReactNode }) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setRole(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single<{ role: string }>();
      if (data?.role) setRole(data.role);
    })();
  }, [user, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  // Service navigation (visible to everyone)
  const serviceNav = [
    { label: 'Flights', href: '/', icon: '✈️' },
    { label: 'Hotel', href: '/hotel', icon: '🏨' },
    { label: 'Tour', href: '/tour', icon: '🏝️' },
    { label: 'Visa', href: '/visa', icon: '🛂' },
    { label: 'T-Card', href: '/gift-card', icon: '🎁' },
  ];

  // Auth / role-based nav
  const authNav: { label: string; href?: string; onClick?: () => void }[] = !user
    ? [
        { label: 'Sign In', href: '/auth/signin' },
        { label: 'Sign Up', href: '/auth/signup' },
      ]
    : [
        ...(role === 'traveler'
          ? [{ label: 'My Tours', href: '/dashboard/traveler' }]
          : role === 'local_guide'
          ? [{ label: 'Manage Tours', href: '/dashboard/local_guide' }]
          : role === 'business_owner'
          ? [{ label: 'Business Dashboard', href: '/dashboard/business_owner' }]
          : role === 'admin'
          ? [{ label: 'Admin Panel', href: '/dashboard/admin' }]
          : []),
        { label: 'Sign Out', onClick: handleSignOut },
      ];

  // Show hero and service nav for everyone
  const showHeroBg = true;
  const showServiceNav = true;

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="relative z-50 bg-white shadow-sm">
        <div
          className={`container mx-auto px-4 py-3 ${
            showServiceNav
              ? 'grid grid-cols-3 items-center'
              : 'flex items-center justify-between'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-900">Tourisn</span>
          </Link>

          {/* Centered Service Nav (visible to everyone) */}
          {showServiceNav && (
            <nav className="hidden md:flex justify-center space-x-6 text-blue-900 font-medium">
              {serviceNav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center space-x-1 hover:text-blue-500 transition"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Right-side Auth/Role Nav */}
          <div
            className={`hidden md:flex space-x-6 text-blue-900 font-medium ${
              showServiceNav ? 'justify-end' : ''
            }`}
          >
            {authNav.map((item) =>
              item.onClick ? (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="hover:text-blue-500 transition"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className="hover:text-blue-500 transition"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-gray-700 justify-self-end"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-white border-t text-blue-900 font-medium">
            <ul className="px-4 py-3 space-y-3">
              {serviceNav.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-2"
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              {authNav.map((item) => (
                <li key={item.label}>
                  {item.onClick ? (
                    <button
                      onClick={() => {
                        item.onClick!();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left hover:text-blue-600"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block hover:text-blue-600"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      {/* MAIN CONTENT with hero background (no gap before footer) */}
      {showHeroBg ? (
        <section className="relative flex-grow flex flex-col m-0 p-0">
          <Image
            src="/images/cox.webp"
            alt="Scenic background"
            fill
            className="object-cover -z-10"
            priority
          />
          <div className="absolute inset-0 bg-black/40 -z-10" />
          <div className="relative container mx-auto px-4 py-8 bg-white/10 rounded-lg flex-grow">
            {children}
          </div>
        </section>
      ) : (
        <main className="flex-grow container mx-auto px-4 py-8 bg-white">
          {children}
        </main>
      )}

      {/* FOOTER (right section at bottom on mobile, dark blue, white text) */}
      <footer className="bg-blue-900 text-white border-t m-0">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10">
            {/* Left: Why Choose Tourisn (top on mobile) */}
            <div className="order-1 md:order-none">
              <h3 className="font-semibold text-lg mb-3">Why Choose Tourisn?</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/tours" className="hover:underline">
                    Easy Booking
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup?role=local_guide" className="hover:underline">
                    Become a Guide
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup?role=business_owner" className="hover:underline">
                    Grow Your Business
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right: Existing links block (pinned to bottom on mobile) */}
            <div className="order-2 md:order-none">
              <p className="mb-4">
                &copy; {new Date().getFullYear()} Tourisn. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="/about" className="hover:underline">
                  About
                </Link>
                <Link href="/contact" className="hover:underline">
                  Contact
                </Link>
                <Link href="/terms" className="hover:underline">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}