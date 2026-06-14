export default function Testimonials() {
  return (
    <section className="py-32 bg-purple-deep relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 80% 80%, rgba(197, 160, 89, 0.08) 0%, transparent 50%)'
        }}
      />

      <div className="section-container relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto animate-fade-in-up">
          <span className="label-caps text-gold tracking-[0.2em]">TESTIMONIALS</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-cream-warm mt-4">
            Voices of Excellence
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-6" />
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          
          {/* Card 1 */}
          <div className="bg-purple-deep/40 border border-gold-shimmer/20 p-8 relative flex flex-col justify-between border-b-2 border-b-gold shadow-gold hover:border-gold-shimmer/40 transition-all duration-300 animate-fade-in-up-delay-1">
            <div>
              <span className="font-display text-6xl text-gold/25 leading-none block -mt-2">“</span>
              <p className="font-body text-cream-dim text-base leading-relaxed -mt-2 italic">
                The platform completely transformed how we managed our national finals. The scoring was real-time and error-free.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gold-shimmer/10">
              <p className="font-display text-base font-semibold text-cream-warm">
                Maria Santos
              </p>
              <p className="label-caps text-gold mt-1 text-[10px] tracking-[0.12em]">
                National Director, Miss Universe Prelims
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-purple-deep/40 border border-gold-shimmer/20 p-8 relative flex flex-col justify-between border-b-2 border-b-gold shadow-gold hover:border-gold-shimmer/40 transition-all duration-300 animate-fade-in-up-delay-2">
            <div>
              <span className="font-display text-6xl text-gold/25 leading-none block -mt-2">“</span>
              <p className="font-body text-cream-dim text-base leading-relaxed -mt-2 italic">
                An unparalleled experience for both judges and contestants. The digital ballots are clean, intuitive, and secure.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gold-shimmer/10">
              <p className="font-display text-base font-semibold text-cream-warm">
                James Chen
              </p>
              <p className="label-caps text-gold mt-1 text-[10px] tracking-[0.12em]">
                Vip Adjudicator Panel
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-purple-deep/40 border border-gold-shimmer/20 p-8 relative flex flex-col justify-between border-b-2 border-b-gold shadow-gold hover:border-gold-shimmer/40 transition-all duration-300 animate-fade-in-up-delay-3">
            <div>
              <span className="font-display text-6xl text-gold/25 leading-none block -mt-2">“</span>
              <p className="font-body text-cream-dim text-base leading-relaxed -mt-2 italic">
                Crown & Glory elevated our pageantry operations to international standards. The client support is elite.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-gold-shimmer/10">
              <p className="font-display text-base font-semibold text-cream-warm">
                Amara Okafor
              </p>
              <p className="label-caps text-gold mt-1 text-[10px] tracking-[0.12em]">
                Executive Director, Miss Earth Regional
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}