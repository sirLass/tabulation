"use client";

import React from "react";

export default function UserCategory() {
  const categories = [
    {
      title: "Event Organizer",
      description: "Establish competitions, coordinate VIP judging panels, manage contestant profiles, and choreograph live pageantry events.",
      link: "/organizer/auth-organizer",
      badge: "Management Portal",
    },
    {
      title: "Supporter",
      description: "Follow prestigious competitions, view schedules, vote for your favorite delegates, and cheer them on to the crown.",
      link: "/user-category/pageant",
      badge: "Public Access",
    },
  ];

  return (
    <div className="relative min-h-screen bg-purple-deep flex flex-col justify-center items-center overflow-hidden py-20 px-4">
      {/* Spotlight Radial Glow */}
      <div
        className="absolute inset-0 z-0 opacity-80"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(197, 160, 89, 0.12) 0%, transparent 65%)",
        }}
      />

      {/* Decorative Diamonds */}
      <div className="absolute top-[15%] left-[10%] w-4 h-4 border border-gold-shimmer/25 rotate-45 animate-float z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-5 h-5 border border-gold-shimmer/25 rotate-45 animate-float-slow z-0" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 w-full max-w-5xl text-center">
        {/* Header */}
        <div className="mb-16 animate-fade-in-up">
          <span className="label-caps text-gold tracking-[0.25em] mb-4 block">
            PORTAL ACCESS
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-warm tracking-tight">
            Select Your Category
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
          {categories.map((cat, idx) => (
            <a
              key={idx}
              href={cat.link}
              className="group bg-purple-deep/40 border border-gold-shimmer/20 p-8 relative flex flex-col justify-between border-b-2 border-b-gold shadow-gold hover:border-gold-shimmer/40 hover:shadow-gold-glow transition-all duration-300 animate-fade-in-up-delay-1"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-gold text-2xl leading-none">◇</span>
                  <span className="label-caps text-gold text-[9px] border border-gold/30 px-2 py-1 tracking-wider">
                    {cat.badge}
                  </span>
                </div>
                <h2 className="font-display text-xl font-semibold text-cream-warm group-hover:text-gold transition-colors duration-200">
                  {cat.title}
                </h2>
                <p className="font-body text-cream-dim/70 text-sm leading-relaxed mt-3">
                  {cat.description}
                </p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-gold font-body text-xs font-semibold uppercase tracking-widest">
                <span className="gold-underline">Enter Portal</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer copyright note */}
      <p className="relative z-10 font-body text-[10px] text-gold-shimmer/30 uppercase tracking-widest mt-16">
        © 2026 Crown & Glory. All rights reserved.
      </p>
    </div>
  );
}
