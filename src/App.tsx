import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesMenu from './components/ServicesMenu';
import PortfolioGallery from './components/PortfolioGallery';
import Reviews from './components/Reviews';
import AboutAndStory from './components/AboutAndStory';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';
import { MessageCircle, Sparkles, MapPin, Phone, Clock, X } from 'lucide-react';
import { SALON_INFO } from './data';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isBookingClosedOpen, setIsBookingClosedOpen] = useState(false);

  useEffect(() => {
    (window as any).showBookingClosedModal = () => {
      setIsBookingClosedOpen(true);
    };
    return () => {
      delete (window as any).showBookingClosedModal;
    };
  }, []);

  // Simple scroll-spy to highlight active section in Header
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'gallery', 'about', 'reviews', 'contact'];
      const scrollPos = window.scrollY + 120; // safe header offset

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg-primary font-sans text-brand-text-dark selection:bg-brand-primary/10 selection:text-brand-primary">
      
      {/* Sticky Top Header */}
      <Header 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero 
          onExploreServices={() => {
            const element = document.getElementById('services');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        />

        {/* Why Choose Us & Salon Story */}
        <ScrollReveal direction="up" duration={800}>
          <AboutAndStory />
        </ScrollReveal>

        {/* Services Tabbed Accordion Menu */}
        <ScrollReveal direction="up" duration={900}>
          <ServicesMenu />
        </ScrollReveal>

        {/* Immersive Portfolio Gallery */}
        <ScrollReveal direction="up" duration={900}>
          <PortfolioGallery />
        </ScrollReveal>

        {/* Client Reviews */}
        <ScrollReveal direction="up" duration={800}>
          <Reviews />
        </ScrollReveal>
      </main>

      {/* Footer Contact Sheet */}
      <Footer />

      {/* Floating Sticky CTA Buttons */}
      {SALON_INFO.whatsappBookingsActive && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
          {/* Floating WhatsApp Bubble */}
          <a
            id="floating-whatsapp-bubble"
            href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup,%20I'd%20like%20to%20book%20an%20appointment%20or%20consult%20about%20my%20bridal/makeup%20look.`}
            target="_blank"
            rel="noreferrer"
            className="bg-[#25D366] hover:bg-[#20BA56] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-2 border-white group relative"
            title="Book on WhatsApp"
          >
            <MessageCircle className="h-5.5 w-5.5" />
            <span className="absolute right-14 bg-brand-bg-primary text-brand-text-dark text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg shadow-md border border-brand-secondary/20 scale-0 group-hover:scale-100 origin-right transition-all duration-200 whitespace-nowrap">
              WhatsApp Booking
            </span>
          </a>
        </div>
      )}

      {/* Booking Temporarily Paused Modal */}
      {isBookingClosedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsBookingClosedOpen(false)}
            className="absolute inset-0 bg-brand-primary/40 backdrop-blur-md transition-opacity duration-300"
          />
          <div className="bg-brand-bg-primary border border-brand-secondary/15 rounded-3xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl text-center">
            <button 
              onClick={() => setIsBookingClosedOpen(false)}
              className="absolute top-4 right-4 text-brand-text-muted hover:text-brand-text-dark transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-12 w-12 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mx-auto mb-4">
              <Clock className="h-6 w-6 text-brand-purple" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-brand-primary mb-3">
              WhatsApp Booking Offline
            </h3>
            <div className="font-sans text-sm text-brand-text-muted leading-relaxed mb-6 space-y-4">
              <p>
                Our online WhatsApp booking system is temporarily paused for scheduling updates.
              </p>
              <p className="bg-brand-primary/5 border border-brand-primary/10 p-3.5 rounded-2xl text-brand-text-dark">
                For bridal makeup appointments or styling slot availability, please **walk in directly** to our studios:
                <br/>
                <span className="font-bold text-brand-primary block mt-1.5">Indore: Scheme No 54, Vijay Nagar</span>
                <span className="font-bold text-brand-primary block mt-1">Ujjain: Freegunj Walk-in Spot</span>
              </p>
            </div>
            <button
              onClick={() => setIsBookingClosedOpen(false)}
              className="w-full bg-brand-primary hover:bg-brand-primary/95 text-brand-bg-primary font-sans font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-98"
            >
              Got It, Thanks!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
