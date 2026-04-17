"use client";

import { useState } from 'react';
import { Logo } from '@/components/Logo';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Logo subline="ONE PLATFORM. SPECIALIZED PACKAGES." />

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary navigation">
          <a href="/platform">Platform</a>
          <a href="/verticals">Verticals</a>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/demo">Demo</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/live-demo">Live Demo</a>
          <a className="nav-link-utility" href="/login">Login</a>
          <a className="nav-link-utility" href="/portal">Portal</a>
          <a className="nav-link-utility" href="/admin">Admin</a>
        </nav>

        <div className="nav-cta">
          <div className="nav-utility">
            <a href="/login">Login</a>
            <a href="/portal">Portal</a>
            <a href="/admin">Admin</a>
          </div>
          <a className="btn ghost" href="/contact#quickstart-order" data-track="nav_get_quote">Get Quote</a>
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
