import React from 'react';
import { MessageCircle, Sparkles, MapPin, Award, ArrowUpRight, Scissors, Feather, Heart } from 'lucide-react';
import { SALON_INFO } from '../data';
import heroBride from '../assets/images/regenerated_image_1784135367248.jpg';

interface HeroProps {
  onOpenConsultant: () => void;
  onExploreServices: () => void;
}

export default function Hero({ onOpenConsultant, onExploreServices }: HeroProps) {
  const scrollToCategory = (categoryId: string) => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // If we can dispatch a custom event to change the category, let's do it, or simply navigate
      const event = new CustomEvent('changeServiceCategory', { detail: categoryId });
      window.dispatchEvent(event);
    }
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    if (!SALON_INFO.whatsappBookingsActive) {
      e.preventDefault();
      if ((window as any).showBookingClosedModal) {
        (window as any).showBookingClosedModal();
      }
    }
  };

  return (
    <section 
      id="home" 
      className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-brand-bg-primary"
    >
      {/* Decorative Blur Accents */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Mobile Header Banner */}
        <div className="text-center md:hidden mb-8">
          <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-brand-primary/10 rounded-full text-brand-primary text-[10px] font-sans font-bold tracking-wider uppercase mb-3">
            <Award className="h-3.5 w-3.5" />
            <span>Indore & Ujjain's Premium Sanctuary</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-primary leading-tight">
            Every Bride Deserves <span className="italic text-brand-secondary">A 5-Star Glow</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-brand-text-muted mt-2 px-4">
            Where local Indian warmth meets luxury salon standards. Located in Scheme 54, Indore & Freegunj, Ujjain.
          </p>
        </div>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Spotlight Hero Box (Col span 7, Row span 2) */}
          <div className="md:col-span-7 md:row-span-2 relative rounded-3xl overflow-hidden min-h-[420px] lg:min-h-[500px] flex items-end p-6 lg:p-8 xl:p-10 shadow-lg group">
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={heroBride} 
                alt="Radiant Indian Bride Makeup Look"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-103 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2d0019]/95 via-[#2d0019]/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-brand-primary/20 mix-blend-overlay z-10" />
            </div>

            {/* Interactive Badge & Content */}
            <div className="relative z-20 text-left">
              <span className="inline-block px-3 py-1 bg-brand-purple text-white text-[9px] font-bold uppercase tracking-widest mb-3 rounded-sm border border-white/10 shadow-sm">
                Premium Spotlight
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-serif text-white leading-tight mb-3">
                The Art of <span className="italic text-brand-secondary">Bridal</span><br/>Transformation
              </h2>
              <p className="text-white/85 max-w-md text-sm sm:text-base leading-relaxed mb-4 xl:mb-6 font-light">
                From traditional Ujjain heritage lookups to modern high-definition contouring. Master bridal & engagement makeups designed with safe skin-prep rituals.
              </p>
              
              {/* Core Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  id="bento-whatsapp-booking"
                  href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup,%20I'd%20like%20to%20consult%20and%20book%20a%20bridal/makeup%20session%20at%20your%20salon.`}
                  target="_blank"
                  onClick={handleBookingClick}
                  rel="noreferrer"
                  className="px-6 py-3 bg-brand-purple text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg hover:bg-brand-purple/90 transition-all flex items-center justify-center space-x-2 border border-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Book on WhatsApp</span>
                </a>

                <button
                  id="bento-ai-consultant"
                  onClick={onOpenConsultant}
                  className="px-6 py-3 bg-white text-brand-primary font-bold text-xs uppercase tracking-widest rounded-full shadow-lg hover:bg-brand-bg-secondary transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="h-4 w-4 text-brand-purple fill-brand-purple/20 animate-pulse" />
                  <span>AI Bridal Planner</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Showcase Title (Col span 5, Row span 1) */}
          <div className="hidden md:flex md:col-span-5 flex-col justify-center text-left p-6 lg:p-8 bg-transparent">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-primary/10 rounded-full text-brand-primary text-xs font-sans font-bold tracking-wider uppercase self-start mb-4">
              <Award className="h-4 w-4 text-brand-purple" />
              <span>Indore & Ujjain's Premium Sanctuary</span>
            </span>
            <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-brand-primary leading-tight">
              Every Bride Deserves <span className="italic text-brand-secondary">A 5-Star Glow</span>
            </h1>
            <p className="font-sans text-sm lg:text-base text-brand-text-muted mt-3 leading-relaxed">
              Where local Indian warmth meets luxury salon standards. Experience custom beauty consults, clinical skin cleanups, and artistic styling in Scheme 54, Indore & Freegunj, Ujjain.
            </p>
            <button
              onClick={onExploreServices}
              className="mt-6 font-sans text-xs font-bold uppercase tracking-wider text-brand-purple hover:text-brand-primary flex items-center gap-1.5 transition-colors self-start border-b border-brand-purple/30 pb-0.5 hover:border-brand-primary"
            >
              <span>Explore Services Catalog</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          {/* Hair Styling Card (Col span 5, Row span 1) */}
          <div 
            onClick={() => scrollToCategory('hair')}
            className="md:col-span-5 bg-white border border-brand-secondary/20 rounded-3xl p-6 flex flex-col justify-between text-left shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="h-10 w-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-brand-bg-primary transition-colors">
                <Scissors className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-brand-text-muted opacity-30 group-hover:opacity-100 transition-all" />
            </div>
            <div className="mt-8">
              <h3 className="font-serif text-lg font-bold text-brand-primary group-hover:text-brand-secondary transition-colors flex items-center gap-1">
                <span>Hair Texture</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all text-brand-purple" />
              </h3>
              <p className="text-xs text-brand-text-muted leading-tight">
                Keratin, smooth treatments, and customized protein restructuring for silky, radiant locks.
              </p>
            </div>
          </div>

          {/* Elite Artistry Card (Col span 3, Row span 1) */}
          <div 
            onClick={() => scrollToCategory('nails')}
            className="md:col-span-3 bg-white border border-brand-secondary/20 rounded-3xl p-5 flex flex-col justify-between text-left shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <span className="font-serif text-3xl font-bold text-brand-primary/45">03</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-brand-secondary opacity-30 group-hover:opacity-100 transition-all" />
            </div>
            <div className="my-1 lg:my-0">
              <div className="text-xs lg:text-[10px] xl:text-xs font-bold uppercase tracking-wider text-brand-primary mt-1">Elite Artistry</div>
              <p className="text-xs lg:text-[10px] xl:text-xs text-brand-text-muted mt-0.5 leading-tight">9D Cat Eye, Chrome & Gel.</p>
            </div>
            <div className="h-8 lg:h-9 xl:h-10 w-full bg-brand-secondary/10 rounded-xl border border-dashed border-brand-secondary/40 mt-2 flex items-center justify-center">
              <Feather className="h-3.5 w-3.5 text-brand-secondary" />
              <span className="text-[10px] font-sans font-bold text-brand-secondary ml-1.5">Nail Art Studio</span>
            </div>
          </div>

          {/* Luxury Skin Glows (Col span 4, Row span 1) */}
          <div 
            onClick={() => scrollToCategory('facials')}
            className="md:col-span-4 bg-white border border-brand-secondary/20 rounded-3xl p-5 flex flex-col justify-between text-left shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <span className="text-brand-purple text-[10px] xl:text-xs shrink-0">★★★★★</span>
              <Heart className="h-4 w-4 text-brand-secondary fill-brand-secondary/20" />
            </div>
            <div className="my-1 lg:my-0">
              <p className="text-xs xl:text-sm text-brand-text-muted leading-relaxed">
                Luxury skin glows, bride-to-be body polishing, and clinical deep cleanups.
              </p>
            </div>
            <h3 className="font-serif text-base font-bold text-brand-primary group-hover:text-brand-secondary transition-colors mt-2 flex items-center justify-between">
              <span>Premium D-Tan</span>
              <ArrowUpRight className="h-4 w-4 opacity-30 group-hover:opacity-100 transition-all" />
            </h3>
          </div>

          {/* Trust Metric Box (Col span 5, Row span 1) - Replaces static image to give cleaner text space */}
          <div className="md:col-span-5 bg-brand-bg-secondary border border-brand-secondary/10 rounded-3xl p-5 lg:p-6 flex flex-col justify-center text-left">
            <div className="flex items-center space-x-3 mb-2.5 xl:mb-4">
              <div className="bg-brand-primary/10 p-2 rounded-xl text-brand-primary">
                <Heart className="h-5 w-5 text-brand-purple fill-brand-purple/20" />
              </div>
              <div>
                <div className="text-xs font-bold text-brand-text-dark">Years of Pure Trust</div>
                <div className="text-xs text-brand-text-muted font-sans">Trusted by brides across Indore & Ujjain</div>
              </div>
            </div>
            <div className="h-[1px] w-full bg-brand-secondary/15 mb-2.5 xl:mb-4"></div>
            <div className="flex justify-between items-center gap-2">
              <div className="text-xs text-brand-text-muted">
                <p className="font-bold text-brand-text-dark">Vijay Nagar, Indore</p>
                <p className="mt-0.5">Scheme No 54, Main Rd</p>
              </div>
              <div className="text-xs text-brand-text-muted">
                <p className="font-bold text-brand-text-dark">Freegunj, Ujjain</p>
                <p className="mt-0.5">Studio Walk-in Spot</p>
              </div>
            </div>
          </div>

          {/* Bottom Dual Block: Pedicures & Instant WhatsApp Booking (Col span 7, Row span 2) */}
          <div className="md:col-span-7 flex flex-col sm:flex-row gap-4">
            
            {/* Pedicures Block */}
            <div 
              onClick={() => scrollToCategory('hand-feet')}
              className="flex-1 bg-white border border-brand-secondary/20 rounded-2xl p-4 lg:p-4 xl:p-6 flex flex-col justify-center text-left shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer group"
            >
              <div className="text-xs uppercase tracking-wider text-brand-text-muted mb-1 font-bold">Hand & Feet Treatment</div>
              <div className="text-lg lg:text-base xl:text-xl font-serif text-brand-primary font-bold group-hover:text-brand-secondary transition-colors flex items-center gap-1">
                <span>Spa Pedicures</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all text-brand-purple" />
              </div>
              <div className="text-[10px] text-brand-purple mt-1 italic font-sans font-medium">Premium Rejuvenation</div>
            </div>

            {/* Instant Booking Block */}
            <a
              id="bento-instant-booking-tile"
              href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup,%20I%20want%20to%20instantly%20reserve%20a%20salon%20slot.%20Please%20share%20availability.`}
              target="_blank"
              onClick={handleBookingClick}
              rel="noreferrer"
              className="flex-[1.4] bg-white border-2 border-brand-primary rounded-2xl p-4 lg:p-4 xl:p-6 flex items-center justify-between group shadow-md hover:bg-brand-bg-secondary transition-all text-left"
            >
              <div className="max-w-[70%]">
                <span className="inline-flex items-center space-x-1 bg-[#25D366]/10 text-[#25D366] px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mb-1">
                  <span className="h-1 w-1 rounded-full bg-[#25D366] animate-ping" />
                  <span>Always Online</span>
                </span>
                <h4 className="text-brand-primary font-bold text-xs lg:text-xs xl:text-sm uppercase tracking-wider">Instant Booking</h4>
                <p className="text-xs lg:text-[11px] xl:text-sm text-brand-text-muted mt-0.5 leading-tight">
                  Skip the line. Click here to confirm instantly.
                </p>
              </div>
              <div className="bg-[#25D366] text-white w-10 h-10 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0 ml-1">
                <svg viewBox="0 0 24 24" className="w-5 h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L22 2l-1.5 5.5Z"></path></svg>
              </div>
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}
