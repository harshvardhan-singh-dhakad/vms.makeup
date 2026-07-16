import React from 'react';
import { SALON_INFO } from '../data';
import { Phone, Mail, MapPin, Clock, MessageCircle, Heart, Sparkles, Navigation } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-brand-primary text-brand-bg-primary pt-16 pb-8 relative overflow-hidden">
      {/* Decorative Gold Border Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-brand-bg-secondary/15">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-4 flex flex-col space-y-4 text-left">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 flex items-center justify-center rounded-full overflow-hidden bg-white shadow-sm">
                <img 
                  src="/logo.svg" 
                  alt="VMS Logo" 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/ffffff/d4af37?text=VMS' }} 
                />
              </div>
              <div className="ml-2">
                <span className="font-serif text-xl font-bold tracking-tight">
                  {SALON_INFO.name}
                </span>
                <span className="block text-[8px] uppercase tracking-widest text-brand-gold font-bold">
                  Bridal & Beauty Studio
                </span>
              </div>
            </div>
            <p className="font-sans text-xs text-brand-bg-primary/85 leading-relaxed max-w-sm">
              Ujjain's ultimate luxury parlour experience. Trusted across Madhya Pradesh for gorgeous finished wedding lookups, precision hair textures, and artistic nails.
            </p>
            <div className="pt-2">
              <a
                id="footer-whatsapp-chat"
                href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup,%20I'd%20like%20to%20book%20a%20bridal/makeup%20session%20at%20your%20salon.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-2 bg-brand-gold text-brand-primary px-5 py-2.5 rounded-xl font-sans text-xs font-bold shadow-md hover:bg-brand-gold/90 transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Column 2: Hours & Details */}
          <div className="md:col-span-4 flex flex-col space-y-4 text-left">
            <h3 className="font-serif text-base font-bold text-brand-gold uppercase tracking-wider">
              Business Hours
            </h3>
            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-start space-x-2.5">
                <Clock className="h-4.5 w-4.5 text-brand-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Weekdays</p>
                  <p className="text-brand-bg-primary/85 mt-0.5">{SALON_INFO.hours.weekdays}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <Clock className="h-4.5 w-4.5 text-brand-gold mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Weekends</p>
                  <p className="text-brand-bg-primary/85 mt-0.5">{SALON_INFO.hours.weekends}</p>
                </div>
              </div>
              <p className="text-[10px] text-brand-gold font-medium italic">
                * {SALON_INFO.hours.note}
              </p>
            </div>
          </div>

          {/* Column 3: Directions & Map */}
          <div className="md:col-span-4 flex flex-col space-y-4 text-left">
            <h3 className="font-serif text-base font-bold text-brand-gold uppercase tracking-wider">
              Reach Our Studio
            </h3>
            <div className="space-y-3 font-sans text-xs">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-4.5 w-4.5 text-brand-gold mt-0.5 shrink-0" />
                <p className="text-brand-bg-primary/85 leading-relaxed">
                  {SALON_INFO.address}
                </p>
              </div>
              {SALON_INFO.contactNumber && (
                <div className="flex items-start space-x-2.5">
                  <Phone className="h-4.5 w-4.5 text-brand-gold mt-0.5 shrink-0" />
                  <a href={`tel:${SALON_INFO.contactNumber}`} className="hover:underline hover:text-brand-gold">
                    {SALON_INFO.contactNumber}
                  </a>
                </div>
              )}
            </div>

            {/* Simulated/Link-based Location Mini-Map Card */}
            <div className="bg-brand-bg-secondary/10 border border-brand-bg-secondary/20 p-3.5 rounded-xl flex items-center justify-between text-left">
              <div>
                <h4 className="font-sans font-bold text-xs">Freegunj, Ujjain</h4>
                <p className="text-[10px] text-brand-bg-primary/80 mt-0.5">Click to view directions in Google Maps</p>
              </div>
              <a
                id="google-maps-directions"
                href="https://maps.google.com/?q=Freegunj+Ujjain+Madhya+Pradesh"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-lg bg-brand-gold text-brand-primary flex items-center justify-center hover:bg-brand-gold/90 transition-all shrink-0"
                aria-label="Directions in Google Maps"
              >
                <Navigation className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom Block */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-xs text-brand-bg-primary/75 space-y-4 sm:space-y-0">
          <p>© {currentYear} {SALON_INFO.name} Salon & Bridal Studio. All rights reserved.</p>
          <div className="flex items-center space-x-1.5">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-brand-gold fill-brand-gold animate-pulse" />
            <span>in Ujjain, MP</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
