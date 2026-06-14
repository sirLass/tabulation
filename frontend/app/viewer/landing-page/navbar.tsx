"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300">
      <div className="section-container flex items-center justify-between py-5">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-2.5 h-2.5 bg-gold rotate-45 transition-transform duration-500 group-hover:rotate-135"></div>
          <span className="font-display text-xl font-bold tracking-tight text-on-surface">
            Crown & Glory
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-on-surface-variant hover:text-gold transition-colors gold-underline"
          >
            About Us
          </a>
          <a
            href="#"
            className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-on-surface-variant hover:text-gold transition-colors gold-underline"
          >
            Events
          </a>
          <a
            href="#"
            className="font-body text-sm font-semibold uppercase tracking-[0.1em] text-on-surface-variant hover:text-gold transition-colors gold-underline"
          >
            Subscription
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a
            href="/user-category/category"
            className="inline-block bg-gold text-white font-body text-sm font-semibold uppercase tracking-[0.1em] px-6 py-3 btn-shimmer hover:bg-gold-dark transition-colors"
          >
            GET STARTED
          </a>
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col justify-between w-6 h-4 focus:outline-none z-50"
          aria-label="Toggle Menu"
        >
          <span
            className={`h-[2px] bg-on-surface transition-all duration-300 ${
              isOpen ? "w-6 rotate-45 translate-y-[7px]" : "w-6"
            }`}
          />
          <span
            className={`h-[2px] bg-on-surface transition-all duration-300 ${
              isOpen ? "w-0 opacity-0" : "w-6"
            }`}
          />
          <span
            className={`h-[2px] bg-on-surface transition-all duration-300 ${
              isOpen ? "w-6 -rotate-45 -translate-y-[7px]" : "w-6"
            }`}
          />
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-cream-warm flex flex-col justify-center items-center z-40 transition-transform duration-500 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-8 text-center">
          <a
            href="#"
            onClick={() => setIsOpen(false)}
            className="font-body text-xl font-semibold uppercase tracking-[0.15em] text-on-surface hover:text-gold transition-colors"
          >
            About Us
          </a>
          <a
            href="#"
            onClick={() => setIsOpen(false)}
            className="font-body text-xl font-semibold uppercase tracking-[0.15em] text-on-surface hover:text-gold transition-colors"
          >
            Events
          </a>
          <a
            href="#"
            onClick={() => setIsOpen(false)}
            className="font-body text-xl font-semibold uppercase tracking-[0.15em] text-on-surface hover:text-gold transition-colors"
          >
            Subscription
          </a>
          <div className="mt-4">
            <a
              href="/viewer/authentication/login"
              onClick={() => setIsOpen(false)}
              className="inline-block bg-gold text-white font-body text-sm font-semibold uppercase tracking-[0.1em] px-8 py-4 btn-shimmer hover:bg-gold-dark transition-colors"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}