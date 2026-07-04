export default function Footer() {
  return (
    <footer className="bg-purple-deep text-cream-dim pt-20 pb-8 border-t border-gold-shimmer/10 relative z-10">
      <div className="section-container">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Col 1: Brand Info */}
          <div>
            <span className="font-display text-2xl font-bold text-cream-warm tracking-tight">
              Crown & Glory
            </span>
            <p className="font-body text-sm text-cream-dim/60 mt-4 leading-relaxed max-w-sm">
              The premier digital ecosystem for prestigious international pageants. Architected for elegance, transparency, and operational excellence.
            </p>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h4 className="label-caps text-gold text-[11px] mb-4 tracking-[0.15em]">
              Platform
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  Live Events
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  Scoring System
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  Organizer Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h4 className="label-caps text-gold text-[11px] mb-4 tracking-[0.15em]">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  Press Kit
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal */}
          <div>
            <h4 className="label-caps text-gold text-[11px] mb-4 tracking-[0.15em]">
              Legal
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="font-body text-sm text-cream-dim/70 hover:text-gold transition-colors duration-200">
                  Security Standards
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Gold Accent Divider */}
        <div className="w-full h-px bg-gold/15 mt-16 mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-cream-dim/40 uppercase tracking-widest text-center md:text-left">
            © 2026 Crown & Glory. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-body text-xs text-cream-dim/40 hover:text-gold transition-colors duration-200 uppercase tracking-wider">
              Instagram
            </a>
            <a href="#" className="font-body text-xs text-cream-dim/40 hover:text-gold transition-colors duration-200 uppercase tracking-wider">
              Twitter
            </a>
            <a href="#" className="font-body text-xs text-cream-dim/40 hover:text-gold transition-colors duration-200 uppercase tracking-wider">
              LinkedIn
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}