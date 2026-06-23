export default function HeroSection() {
  return (
    <div className="relative min-h-screen bg-purple-deep flex flex-col justify-center items-center overflow-hidden pt-20">
      {/* Radial spotlight gold gradient overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-80"
        style={{
          background: 'radial-gradient(ellipse at 50% 35%, rgba(197, 160, 89, 0.15) 0%, transparent 65%)'
        }}
      />

      {/* Decorative Floating Diamonds */}
      <div className="absolute top-[20%] left-[15%] w-4 h-4 border border-gold-shimmer/30 rotate-45 animate-float z-0" />
      <div className="absolute top-[35%] right-[10%] w-6 h-6 border border-gold-shimmer/20 rotate-45 animate-float-slow z-0" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[25%] left-[20%] w-5 h-5 border border-gold-shimmer/25 rotate-45 animate-float-slower z-0" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-[40%] right-[25%] w-3 h-3 border border-gold-shimmer/40 rotate-45 animate-float z-0" style={{ animationDelay: '2s' }} />

      {/* Content Container */}
      <div className="section-container relative z-10 text-center flex flex-col items-center justify-center">
        <span className="label-caps text-gold tracking-[0.2em] mb-6 block animate-fade-in-up">
          THE PREMIER PAGEANTRY PLATFORM
        </span>
        
        <h1 className="font-display text-cream-warm text-5xl md:text-7xl lg:text-[64px] font-bold tracking-tight leading-[1.1] max-w-4xl animate-fade-in-up-delay-1">
          Where Excellence Meets <br />
          <span className="text-gold-gradient">the Spotlight</span>
        </h1>
        
        <p className="font-body text-gold-shimmer/80 text-lg md:text-xl max-w-2xl mt-6 leading-relaxed animate-fade-in-up-delay-2">
          An elite digital ecosystem designed for prestigious international pageants. Empowering organizers, judges, and contestants with precision scoring and seamless management.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto px-4 justify-center items-center animate-fade-in-up-delay-3">
          <a
            href="#"
            className="w-full sm:w-auto bg-gold text-white px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.1em] text-center btn-shimmer hover:bg-gold-dark transition-all duration-300"
          >
            Explore Events
          </a>
          <a
            href="#"
            className="w-full sm:w-auto border border-gold text-gold hover:text-white px-8 py-4 font-body text-sm font-semibold uppercase tracking-[0.1em] text-center hover:bg-gold/10 transition-all duration-300"
          >
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll Down Chevron */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center gap-2 z-10 opacity-70">
        <span className="label-caps text-gold-shimmer/50 text-[9px] tracking-[0.35em] block">SCROLL</span>
        <div className="w-4 h-4 border-b-2 border-r-2 border-gold-shimmer/60 rotate-45 animate-chevron" />
      </div>
    </div>
  );
}