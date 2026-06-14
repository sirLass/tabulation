"use client";

import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering with:", { name, email, password });
  };

  return (
    <div className="relative min-h-screen bg-purple-deep flex flex-col justify-center items-center overflow-hidden py-16 px-4">
      {/* Background radial spotlight gold glow */}
      <div
        className="absolute inset-0 z-0 opacity-80"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.12) 0%, transparent 60%)",
        }}
      />

      {/* Back to Home Link */}
      <div className="absolute top-8 left-8 z-10">
        <a
          href="/"
          className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-gold-shimmer hover:text-gold transition-colors flex items-center gap-2 group"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span className="gold-underline">Back to Home</span>
        </a>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-purple-deep/40 border border-gold-shimmer/20 p-8 md:p-10 border-b-2 border-b-gold shadow-gold-glow animate-fade-in-up">
        {/* Brand/Heading */}
        <div className="text-center mb-10">
          <div className="w-2.5 h-2.5 bg-gold rotate-45 mx-auto mb-4"></div>
          <h1 className="font-display text-3xl font-bold text-cream-warm tracking-tight">
            Crown & Glory
          </h1>
          <p className="label-caps text-gold mt-2 tracking-[0.2em] text-[10px]">
            Create Account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Full Name Input */}
          <div className="flex flex-col gap-1.5 relative group">
            <label
              htmlFor="name"
              className="label-caps text-gold-shimmer/70 text-[10px] tracking-[0.15em] font-semibold"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-transparent border-b border-gold-shimmer/35 text-cream-warm placeholder-gold-shimmer/30 font-body text-sm py-2 px-0 focus:outline-none focus:border-b-2 focus:border-gold transition-all duration-200"
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-1.5 relative group">
            <label
              htmlFor="email"
              className="label-caps text-gold-shimmer/70 text-[10px] tracking-[0.15em] font-semibold"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-transparent border-b border-gold-shimmer/35 text-cream-warm placeholder-gold-shimmer/30 font-body text-sm py-2 px-0 focus:outline-none focus:border-b-2 focus:border-gold transition-all duration-200"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5 relative group">
            <label
              htmlFor="password"
              className="label-caps text-gold-shimmer/70 text-[10px] tracking-[0.15em] font-semibold"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full bg-transparent border-b border-gold-shimmer/35 text-cream-warm placeholder-gold-shimmer/30 font-body text-sm py-2 px-0 focus:outline-none focus:border-b-2 focus:border-gold transition-all duration-200"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 mt-4">
            <button
              type="submit"
              className="w-full bg-gold text-white font-body text-xs font-semibold uppercase tracking-[0.15em] py-4 btn-shimmer hover:bg-gold-dark transition-colors cursor-pointer"
            >
              Register
            </button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gold-shimmer/10"></div>
              <span className="font-body text-[10px] uppercase tracking-wider text-gold-shimmer/40">
                or
              </span>
              <div className="flex-1 h-px bg-gold-shimmer/10"></div>
            </div>

            <a
              href="/viewer/authentication/login"
              className="w-full text-center border border-gold/45 text-gold hover:text-white hover:bg-gold/10 font-body text-xs font-semibold uppercase tracking-[0.15em] py-4 transition-all duration-300"
            >
              Sign In Instead
            </a>
          </div>
        </form>
      </div>

      {/* Footer copyright note */}
      <p className="relative z-10 font-body text-[10px] text-gold-shimmer/30 uppercase tracking-widest mt-12">
        © 2026 Crown & Glory. Secure Portal.
      </p>
    </div>
  );
}