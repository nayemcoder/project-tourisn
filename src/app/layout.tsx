'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import Image from 'next/image';
import type { Database } from '@/lib/database.types';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <RoleBasedLayout supabase={supabase}>{children}</RoleBasedLayout>
      </body>
    </html>
  );
}

function RoleBasedLayout({
  children,
  supabase,
}: {
  children: ReactNode;
  supabase: ReturnType<typeof createBrowserClient<Database>>;
}) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single<{ role: string }>();

        if (!error && data?.role) setRole(data.role);
      }
    };

    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const serviceNav = [
    { label: 'Flights', href: '/', icon: '✈️' },
    { label: 'Hotel', href: '/hotel', icon: '🏨' },
    { label: 'Tour', href: '/tour', icon: '🏝️' },
    { label: 'Visa', href: '/visa', icon: '🛂' },
    { label: 'T-Card', href: '/gift-card', icon: '🎁' },
  ];

  const authNav: { label: string; href?: string; onClick?: () => void }[] =
    !user
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* HEADER */}
      <header className="relative z-40 bg-white shadow-sm">
        <div className="container mx-auto px-3 py-3 grid grid-cols-3 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="Tourisn Logo"
              width={175}
              height={121}
              priority
            />
          </Link>

          {/* Desktop Service Nav */}
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

          {/* Right Auth Nav */}
          <div className="hidden md:flex justify-end space-x-6 text-blue-900 font-medium">
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

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 justify-self-end"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Dropdown */}
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

      {/* 🌟 Main Content (NO background image here!) */}
      <main className="flex-grow">{children}</main>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#002455' }} className="text-white border-t m-0">
        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Discover */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Discover</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Terms */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Terms & Conditions</h3>
            <ul className="space-y-2">
              <li><Link href="/refund-policy" className="hover:underline">Refund Policy</Link></li>
              <li><Link href="/emi-policy" className="hover:underline">EMI Policy</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact</h3>
            <ul className="space-y-2">
              <li><a href="mailto:info@Touris.com" className="hover:underline">info@Touris.com</a></li>
              <li><span>+88 01717 5298xx</span></li>
            </ul>

            <p className="mt-4">
              <Link href="/auth/signup?role=local_guide" className="hover:underline font-semibold">
                Become a Tour guide for Us
              </Link>
            </p>
          </div>

          {/* Payments */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Payment methods possible</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                'bkash.png',
                'nagad.png',
                'visa.png',
                'mastercard.png',
                'amex.png',
                'rocket.png',
                'dbbl.png',
                'payoneer.png',
              ].map((logo, idx) => (
                <Image
                  key={idx}
                  src={`/images/payments/${logo}`}
                  alt={logo.replace('.png', '')}
                  width={40}
                  height={25}
                  className="object-contain"
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{ backgroundColor: '#050E3C' }}
          className="border-t border-white/20 mt-8 pt-6 px-4 flex flex-col md:flex-row justify-between items-center text-sm"
        >
          <p>&copy; {new Date().getFullYear()} Tourisn. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {[
              { href: 'https://facebook.com', icon: '📘' },
              { href: 'https://twitter.com', icon: '🐦' },
              { href: 'https://instagram.com', icon: '📸' },
              { href: 'https://pinterest.com', icon: '📌' },
            ].map(({ href, icon }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
