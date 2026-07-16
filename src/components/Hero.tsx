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

  return (
    <section 
      id="home" 
      className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-[#FFF8F3]"
    >
      {/* Decorative Blur Accents */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Mobile/Tablet Title (Only visible on small viewports so the screen is not empty before the Bento) */}
        <div className="lg:hidden text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center space-x-1.5 bg-[#7A2E38]/5 border border-[#7A2E38]/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#7A2E38] mb-3">
            <Sparkles className="h-3 w-3 text-[#C9A227] fill-[#C9A227]" />
            <span>Best Bridal & Makeup in Indore & Ujjain</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#7A2E38] leading-tight">
            Every Bride Deserves <span className="italic text-[#B76E79]">A 5-Star Glow</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#6B5B52] mt-2 px-4">
            Where local Indian warmth meets luxury salon standards. Located in Scheme 54, Indore & Freegunj, Ujjain.
          </p>
        </div>

        {/* The Master Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 lg:grid-rows-6 gap-4 min-h-[700px] lg:min-h-[760px] lg:h-[760px]">
          
          {/* Hero Block: Bridal Specialist (Col span 7, Row span 4) */}
          <section className="col-span-1 md:col-span-2 lg:col-span-7 lg:row-span-4 bg-[#7A2E38] rounded-2xl relative overflow-hidden group shadow-xl flex flex-col justify-end p-6 lg:p-8 xl:p-10 border border-[#7A2E38]/20">
            {/* Visual background image with dark overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={heroBride} 
                alt="Indian Bridal Makeup Glow by Vms Makeup" 
                className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B1014]/95 via-[#2B1014]/50 to-transparent z-10" />
              <div className="absolute inset-0 bg-[#3a1510]/30 mix-blend-overlay z-10" />
            </div>

            {/* Interactive Badge & Content */}
            <div className="relative z-20 text-left">
              <span className="inline-block px-3 py-1 bg-[#C9A227] text-white text-[9px] font-bold uppercase tracking-widest mb-3 rounded-sm border border-white/10 shadow-sm">
                Premium Spotlight
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-serif text-white leading-tight mb-3">
                The Art of <span className="italic text-[#B76E79]">Bridal</span><br/>Transformation
              </h2>
              <p className="text-white/80 max-w-md text-xs sm:text-sm lg:text-xs xl:text-sm leading-relaxed mb-4 xl:mb-6 font-light">
                From traditional Ujjain heritage lookups to modern high-definition contouring. Master bridal & engagement makeups designed with safe skin-prep rituals.
              </p>
              
              {/* Core Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  id="bento-whatsapp-booking"
                  href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup,%20I'd%20like%20to%20consult%20and%20book%20a%20bridal/makeup%20session%20at%20your%20salon.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-[#C9A227] text-white font-bold text-xs uppercase tracking-widest rounded-full shadow-lg hover:bg-[#B58E1E] transition-all flex items-center justify-center space-x-2 border border-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Book on WhatsApp</span>
                </a>

                <button
                  id="bento-ai-consultant"
                  onClick={onOpenConsultant}
                  className="px-6 py-3 bg-white text-[#7A2E38] font-bold text-xs uppercase tracking-widest rounded-full shadow-lg hover:bg-[#FFF8F3] transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="h-4 w-4 text-[#C9A227] fill-[#C9A227]/20 animate-pulse" />
                  <span>AI Bridal Planner</span>
                </button>
              </div>
            </div>
          </section>

          {/* Secondary Bento Block: Hair Texture (Col span 5, Row span 2) */}
          <div 
            onClick={() => scrollToCategory('hair-texture')}
            className="col-span-1 lg:col-span-5 lg:row-span-2 bg-white border border-[#B76E79]/20 rounded-2xl p-4 lg:p-5 xl:p-6 flex items-center justify-between shadow-sm hover:shadow-md hover:border-[#7A2E38]/30 transition-all cursor-pointer group"
          >
            <div className="max-w-[70%] text-left">
              <span className="text-[9px] uppercase tracking-wider text-[#C9A227] font-bold">Flawless Texturing</span>
              <h3 className="font-serif text-[#7A2E38] text-xl lg:text-lg xl:text-2xl mt-0.5 mb-1 flex items-center gap-1 group-hover:text-[#B76E79] transition-colors">
                <span>Hair Texture</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all text-[#C9A227]" />
              </h3>
              <p className="text-[11px] text-[#6B5B52] leading-tight">
                Keratin, smooth treatments, and customized protein restructuring for silky, radiant locks.
              </p>
            </div>
            
            <div className="w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-[#FDF6F0] rounded-full border border-[#B76E79]/25 flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
              <Scissors className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-[#7A2E38]" />
              <div className="absolute inset-0 bg-[#B76E79]/5 rounded-full" />
            </div>
          </div>

          {/* Nail Art Bento Card (Col span 2, Row span 2) */}
          <div 
            onClick={() => scrollToCategory('nails')}
            className="col-span-1 lg:col-span-2 lg:row-span-2 bg-[#FDF6F0] border border-[#B76E79]/30 rounded-2xl p-4 lg:p-4 xl:p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#7A2E38]/40 transition-all cursor-pointer text-left group"
          >
            <div className="flex justify-between items-start">
              <span className="text-[#7A2E38] text-lg lg:text-base xl:text-xl font-serif italic group-hover:text-[#B76E79] transition-colors">Nails</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-[#B76E79] opacity-30 group-hover:opacity-100 transition-all" />
            </div>
            <div className="my-1 lg:my-0">
              <div className="text-[10px] lg:text-[9px] xl:text-[11px] font-bold uppercase tracking-wider text-[#7A2E38] mt-1">Elite Artistry</div>
              <p className="text-[10px] lg:text-[9px] xl:text-[10px] text-[#6B5B52] mt-0.5 leading-tight">9D Cat Eye, Chrome & Gel.</p>
            </div>
            <div className="h-8 lg:h-9 xl:h-10 w-full bg-[#B76E79]/10 rounded-xl border border-dashed border-[#B76E79]/40 mt-2 flex items-center justify-center">
              <Feather className="h-3.5 w-3.5 text-[#B76E79]" />
            </div>
          </div>

          {/* Facials & Rituals Bento Card (Col span 3, Row span 2) */}
          <div 
            onClick={() => scrollToCategory('facials')}
            className="col-span-1 lg:col-span-3 lg:row-span-2 bg-white border border-[#B76E79]/20 rounded-2xl p-4 lg:p-4 xl:p-5 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#7A2E38]/30 transition-all cursor-pointer text-left group"
          >
            <div className="flex justify-between items-start gap-1">
              <h3 className="font-serif text-[#7A2E38] text-base lg:text-sm xl:text-lg font-bold group-hover:text-[#B76E79] transition-colors">Facials & Spa</h3>
              <span className="text-[#C9A227] text-[10px] xl:text-xs shrink-0">★★★★★</span>
            </div>
            <div className="my-1 lg:my-0">
              <p className="text-[10px] xl:text-[11px] text-[#6B5B52] leading-relaxed">
                Luxury skin glows, bride-to-be body polishing, and clinical deep cleanups.
              </p>
            </div>
            <span className="text-[9px] font-bold text-[#7A2E38] uppercase underline underline-offset-4 cursor-pointer mt-1 group-hover:text-[#C9A227] transition-colors">
              View Spa Rituals
            </span>
          </div>

          {/* Location / Social Proof Block (Col span 5, Row span 2) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5 lg:row-span-2 bg-[#FDF6F0] rounded-2xl p-4 lg:p-4 xl:p-6 flex flex-col justify-center border border-[#B76E79]/15 shadow-sm text-left">
            <div className="flex items-center space-x-3 mb-2.5 xl:mb-4">
              <div className="w-9 h-9 lg:w-10 lg:h-10 xl:w-11 xl:h-11 bg-[#7A2E38] rounded-full flex items-center justify-center text-white font-serif font-bold shadow-md shrink-0">
                4+
              </div>
              <div>
                <div className="text-xs font-bold text-[#2B2420]">Years of Pure Trust</div>
                <div className="text-[10px] text-[#6B5B52] font-sans">Trusted by brides across Indore & Ujjain</div>
              </div>
            </div>
            <div className="h-[1px] w-full bg-[#B76E79]/15 mb-2.5 xl:mb-4"></div>
            
            <div className="flex justify-between items-center gap-2">
              <div className="text-[10px] text-[#6B5B52]">
                <p className="font-bold text-[#2B2420]">Vijay Nagar, Indore</p>
                <p className="mt-0.5">Scheme No 54, Main Rd</p>
              </div>
              <div className="text-[10px] text-[#6B5B52]">
                <p className="font-bold text-[#2B2420]">Freegunj, Ujjain</p>
                <p className="mt-0.5">Studio Walk-in Spot</p>
              </div>
            </div>
          </div>

          {/* Bottom Dual Block: Pedicures & Instant WhatsApp Booking (Col span 7, Row span 2) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-7 lg:row-span-2 flex flex-col sm:flex-row gap-4">
            
            {/* Hand & Feet Block */}
            <div 
              onClick={() => scrollToCategory('hand-feet')}
              className="flex-1 bg-white border border-[#B76E79]/20 rounded-2xl p-4 lg:p-4 xl:p-6 flex flex-col justify-center text-left shadow-sm hover:shadow-md hover:border-[#7A2E38]/30 transition-all cursor-pointer group"
            >
              <div className="text-[9px] uppercase tracking-wider text-[#6B5B52] mb-1 font-bold">Hand & Feet Treatment</div>
              <div className="text-lg lg:text-base xl:text-xl font-serif text-[#7A2E38] font-bold group-hover:text-[#B76E79] transition-colors flex items-center gap-1">
                <span>Spa Pedicures</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all text-[#C9A227]" />
              </div>
              <div className="text-[10px] text-[#C9A227] mt-1 italic font-sans font-medium">Premium Rejuvenation</div>
            </div>

            {/* Instant Booking Block */}
            <a
              id="bento-instant-booking-tile"
              href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup,%20I%20want%20to%20instantly%20reserve%20a%20salon%20slot.%20Please%20share%20availability.`}
              target="_blank"
              rel="noreferrer"
              className="flex-[1.4] bg-white border-2 border-[#7A2E38] rounded-2xl p-4 lg:p-4 xl:p-6 flex items-center justify-between group shadow-md hover:bg-[#FDF6F0] transition-all text-left"
            >
              <div className="max-w-[70%]">
                <span className="inline-flex items-center space-x-1 bg-[#25D366]/10 text-[#25D366] px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mb-1">
                  <span className="h-1 w-1 rounded-full bg-[#25D366] animate-ping" />
                  <span>Always Online</span>
                </span>
                <h4 className="text-[#7A2E38] font-bold text-xs lg:text-xs xl:text-sm uppercase tracking-wider">Instant Booking</h4>
                <p className="text-[11px] lg:text-[10px] xl:text-xs text-[#6B5B52] mt-0.5 leading-tight">
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
