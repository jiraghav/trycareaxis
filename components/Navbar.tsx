"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { clearClientSession, readClientSession } from '@/lib/auth';

export function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setIsAuthed(readClientSession() !== null);
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
    } catch {
      // Clear local session even if the cookie request fails.
    }

    clearClientSession();
    setIsAuthed(false);
    setOpen(false);
    router.push('/login');
  }

  const authControl = isAuthed ? (
    <button type="button" className="nav-auth-link" onClick={handleLogout}>
      Logout
    </button>
  ) : (
    <a href="/login">Login</a>
  );

  const mobileAuthControl = isAuthed ? (
    <button type="button" className="nav-link-utility nav-auth-link" onClick={handleLogout}>
      Logout
    </button>
  ) : (
    <a className="nav-link-utility" href="/login">Login</a>
  );

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Logo subline="ONE PLATFORM. SPECIALIZED PACKAGES." />

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary navigation">
          <a href="/platform">Platform</a>
          <a href="/verticals">Verticals</a>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/onboarding">Onboarding</a>
          <a href="/demo">Demo</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/live-demo">Live Demo</a>
          {mobileAuthControl}
          {isAuthed ? <a className="nav-link-utility" href="/admin">Admin</a> : null}
        </nav>

        <div className="nav-cta">
          <div className="nav-utility">
            {authControl}
            {isAuthed ? <a href="/admin">Admin</a> : null}
          </div>
          <a className="btn ghost" href="/onboarding" data-track="nav_get_quote">Start Intake</a>
          <a className="btn primary" href="/demo" data-track="nav_book_demo">Book a Demo</a>

          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="mobile-menu-toggle"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
