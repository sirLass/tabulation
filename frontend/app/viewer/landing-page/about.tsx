export default function About() {
  return (
    <section className="py-32 bg-cream-warm border-y border-outline-variant/30 overflow-hidden">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Editorial Info */}
          <div className="animate-fade-in-up">
            <span className="label-caps text-gold">ABOUT THE PLATFORM</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-on-surface mt-4 leading-tight">
              Elevating Pageantry <br />to New Heights
            </h2>
            <p className="font-body text-on-surface-variant text-lg leading-relaxed mt-6 max-w-xl">
              Crown & Glory redefines pageant operations with an upscale administrative portal. Designed for luxury, security, and prestige, we replace outdated paperwork with elegant, real-time technology.
            </p>
            <p className="font-body text-on-surface-variant text-base leading-relaxed mt-4 max-w-xl">
              From application tracking to the final winning moment on stage, every step is choreographed with absolute precision and security.
            </p>
            <div className="w-16 h-0.5 bg-gold mt-8" />
          </div>

          {/* Right Column: Features Grid */}
          <div className="animate-fade-in-up-delay-1">
            <div className="border border-outline-variant bg-cream p-8 md:p-10 relative border-b-2 border-b-gold shadow-gold">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-10">
                
                {/* Feature 1 */}
                <div className="flex flex-col items-start">
                  <span className="text-gold text-2xl leading-none">◇</span>
                  <h3 className="font-display text-lg font-semibold text-on-surface mt-3">
                    Live Scoring
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-2 leading-relaxed">
                    Real-time digital ballots and instant tabulation, ensuring transparency and lightning-fast calculations.
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col items-start">
                  <span className="text-gold text-2xl leading-none">◇</span>
                  <h3 className="font-display text-lg font-semibold text-on-surface mt-3">
                    Event Management
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-2 leading-relaxed">
                    End-to-end competition choreography, schedules, contestant profiles, and ticketing control.
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="flex flex-col items-start">
                  <span className="text-gold text-2xl leading-none">◇</span>
                  <h3 className="font-display text-lg font-semibold text-on-surface mt-3">
                    Global Reach
                  </h3>
                  <p className="font-body text-xs text-on-surface-variant mt-2 leading-relaxed">
                    Multilingual and multi-currency support, linking local preliminaries straight to the international finale.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}