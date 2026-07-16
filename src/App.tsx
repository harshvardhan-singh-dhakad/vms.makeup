import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesMenu from './components/ServicesMenu';
import AIConsultant from './components/AIConsultant';
import PortfolioGallery from './components/PortfolioGallery';
import Reviews from './components/Reviews';
import AboutAndStory from './components/AboutAndStory';
import Footer from './components/Footer';
import ScrollReveal from './components/ScrollReveal';
import { MessageCircle, Sparkles, MapPin, Phone, Clock } from 'lucide-react';
import { SALON_INFO } from './data';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [aiOpen, setAiOpen] = useState(false);

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
        onOpenConsultant={() => setAiOpen(true)}
      />

      {/* Main Sections */}
      <main>
        {/* Hero Section */}
        <Hero 
          onOpenConsultant={() => setAiOpen(true)} 
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

      {/* Immersive AI Beauty / Bridal Consultant Drawer */}
      <AIConsultant 
        isOpen={aiOpen} 
        onClose={() => setAiOpen(false)} 
      />

      {/* Floating Sticky CTA Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        {/* Floating AI Bubble */}
        <button
          id="floating-ai-consultant"
          onClick={() => setAiOpen(true)}
          className="bg-brand-primary hover:bg-brand-primary/95 text-brand-bg-primary p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center border-2 border-brand-gold/40 group relative"
          title="AI Bridal Assistant"
        >
          <Sparkles className="h-5.5 w-5.5 text-brand-gold fill-brand-gold/20 animate-pulse" />
          <span className="absolute right-14 bg-brand-bg-primary text-brand-primary text-[10px] font-sans font-bold px-2.5 py-1 rounded-lg shadow-md border border-brand-secondary/20 scale-0 group-hover:scale-100 origin-right transition-all duration-200 whitespace-nowrap">
            Ask AI Stylist
          </span>
        </button>

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

    </div>
  );
}
