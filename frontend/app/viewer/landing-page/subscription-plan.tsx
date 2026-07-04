"use client";

import { useState } from "react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    label: "For Emerging Pageants",
    weeklyPrice: 19,
    monthlyPrice: 69,
    description:
      "Everything you need to launch and manage your first pageant with confidence.",
    features: [
      "Up to 50 contestants",
      "3 scoring categories",
      "Real-time scoring dashboard",
      "Basic analytics & reports",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    id: "premier",
    name: "Premier",
    label: "Most Popular",
    weeklyPrice: 49,
    monthlyPrice: 179,
    description:
      "The complete toolkit for serious organizers running multi-round competitions.",
    features: [
      "Up to 200 contestants",
      "Unlimited scoring categories",
      "Advanced scoring & tabulation",
      "Multi-round scoring system",
      "Custom branding",
      "Priority support",
      "Detailed analytics suite",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    id: "elite",
    name: "Elite",
    label: "For Grand Events",
    weeklyPrice: 99,
    monthlyPrice: 359,
    description:
      "White-glove infrastructure for international pageants demanding precision at scale.",
    features: [
      "Unlimited contestants",
      "Unlimited scoring panels",
      "Live broadcast scoring overlay",
      "Multi-stage tournament bracket",
      "Dedicated account manager",
      "Custom integrations & API access",
      "24/7 concierge support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function SubscriptionSection() {
  const [billing, setBilling] = useState<"weekly" | "monthly">("monthly");

  return (
    <section className="relative bg-purple-deep py-28 overflow-hidden">
      {/* Radial spotlight — matches hero */}
      <div
        className="absolute inset-0 z-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(197, 160, 89, 0.12) 0%, transparent 65%)",
        }}
      />

      {/* Floating diamonds — mirrors hero language */}
      <div className="absolute top-[12%] left-[8%]  w-4 h-4 border border-gold-shimmer/20 rotate-45 animate-float z-0" />
      <div
        className="absolute top-[55%] right-[6%]  w-6 h-6 border border-gold-shimmer/15 rotate-45 animate-float-slow z-0"
        style={{ animationDelay: "1.2s" }}
      />
      <div
        className="absolute bottom-[18%] left-[14%] w-3 h-3 border border-gold-shimmer/30 rotate-45 animate-float-slower z-0"
        style={{ animationDelay: "0.8s" }}
      />

      <div className="section-container relative z-10">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="label-caps text-gold tracking-[0.2em] mb-4 block">
            SUBSCRIPTION PLANS
          </span>
          <h2 className="font-display text-cream-warm text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] max-w-2xl mx-auto">
            Choose Your{" "}
            <span className="text-gold-gradient">Stage</span>
          </h2>
          <p className="font-body text-gold-shimmer/70 text-base md:text-lg max-w-xl mx-auto mt-4 leading-relaxed">
            Flexible plans crafted for every scale of pageantry — from local
            debuts to global showcases.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center mt-8 border border-gold/30 p-[3px] gap-0">
            <button
              onClick={() => setBilling("weekly")}
              className={`font-body text-xs font-semibold uppercase tracking-[0.12em] px-6 py-2.5 transition-all duration-300 ${
                billing === "weekly"
                  ? "bg-gold text-white"
                  : "text-gold-shimmer/60 hover:text-gold"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setBilling("monthly")}
              className={`font-body text-xs font-semibold uppercase tracking-[0.12em] px-6 py-2.5 transition-all duration-300 ${
                billing === "monthly"
                  ? "bg-gold text-white"
                  : "text-gold-shimmer/60 hover:text-gold"
              }`}
            >
              Monthly
              <span className="ml-2 text-[9px] tracking-[0.08em] text-gold-shimmer/50">
                SAVE ~30%
              </span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col transition-all duration-300 group ${
                plan.highlighted
                  ? "border border-gold/60 bg-gradient-to-b from-gold/[0.07] to-transparent"
                  : "border border-gold-shimmer/15 hover:border-gold-shimmer/35 bg-white/[0.02]"
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-px left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />
              )}

              <div className="p-8 flex flex-col flex-1">
                {/* Plan name + label */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-cream-warm text-xl font-bold tracking-tight">
                      {plan.name}
                    </span>
                    {plan.highlighted ? (
                      <span className="label-caps text-[9px] tracking-[0.18em] text-purple-deep bg-gold px-2 py-1">
                        POPULAR
                      </span>
                    ) : (
                      <span className="label-caps text-[9px] tracking-[0.18em] text-gold-shimmer/50 border border-gold-shimmer/20 px-2 py-1">
                        {plan.label.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-gold-shimmer/60 text-sm leading-snug mt-2">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span className="font-display text-cream-warm text-5xl font-bold tracking-tight leading-none">
                      ${billing === "weekly" ? plan.weeklyPrice : plan.monthlyPrice}
                    </span>
                    <span className="font-body text-gold-shimmer/50 text-sm mb-1.5">
                      /{billing === "weekly" ? "wk" : "mo"}
                    </span>
                  </div>
                  {billing === "monthly" && (
                    <p className="font-body text-gold-shimmer/40 text-xs mt-1 tracking-wide">
                      billed monthly · ~${Math.round(plan.monthlyPrice / 4)}/wk
                    </p>
                  )}
                  {billing === "weekly" && (
                    <p className="font-body text-gold-shimmer/40 text-xs mt-1 tracking-wide">
                      billed weekly · ${plan.monthlyPrice}/mo with monthly plan
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div
                  className={`w-full h-px mb-6 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-transparent via-gold/30 to-transparent"
                      : "bg-gold-shimmer/10"
                  }`}
                />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 font-body text-gold-shimmer/75 text-sm leading-snug"
                    >
                      <span
                        className={`mt-[3px] flex-shrink-0 w-3.5 h-3.5 border rotate-45 flex items-center justify-center ${
                          plan.highlighted
                            ? "border-gold/60"
                            : "border-gold-shimmer/30"
                        }`}
                      >
                        <span
                          className={`block w-1 h-1 rotate-45 ${
                            plan.highlighted ? "bg-gold" : "bg-gold-shimmer/50"
                          }`}
                        />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#"
                  className={`w-full text-center font-body text-sm font-semibold uppercase tracking-[0.1em] px-8 py-4 transition-all duration-300 block ${
                    plan.highlighted
                      ? "bg-gold text-white btn-shimmer hover:bg-gold-dark"
                      : "border border-gold text-gold hover:bg-gold/10 hover:text-cream-warm"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center font-body text-gold-shimmer/35 text-xs tracking-wide mt-10">
          All plans include SSL security, uptime guarantee, and a 7-day money-back assurance.
          <br className="hidden md:block" /> No hidden fees. Cancel anytime.
        </p>
      </div>
    </section>
  );
}