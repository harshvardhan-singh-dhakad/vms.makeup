import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Sparkles, MessageCircle } from 'lucide-react';
import { SALON_INFO } from '../data';
import logoWebp from '../assets/images/regenerated_image_1783878962342.webp';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  onOpenConsultant: () => void;
}

export default function Header({ activeSection, setActiveSection, onOpenConsultant }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'Our Story' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact Us' }
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-brand-bg-secondary/95 backdrop-blur-md shadow-md border-b border-brand-secondary/20 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="h-12 w-12 flex items-center justify-center rounded-full overflow-hidden bg-white border border-brand-gold/30 shadow-sm">
              <img 
                src={logoWebp} 
                alt="VMS Logo" 
                className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-300" 
                referrerPolicy="no-referrer"
                onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100/ffffff/d4af37?text=VMS' }} 
              />
            </div>
            <div className="ml-2 hidden sm:block">
              <span className="font-serif text-2xl font-bold tracking-tight text-brand-primary">
                {SALON_INFO.name}
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-brand-secondary font-semibold">
                Bridal & Beauty Studio
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`font-sans text-sm font-medium tracking-wide transition-colors duration-200 relative py-1 ${
                  activeSection === item.id 
                    ? 'text-brand-primary font-semibold' 
                    : 'text-brand-text-muted hover:text-brand-primary'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              id="header-ai-btn"
              onClick={onOpenConsultant}
              className="flex items-center space-x-1 px-4 py-2 rounded-full border border-brand-primary/30 text-brand-primary font-sans text-xs font-semibold hover:bg-brand-primary/10 transition-colors"
            >
              <Sparkles className="h-4.5 w-4.5 text-brand-gold fill-brand-gold/30" />
              <span>AI Bridal Consultant</span>
            </button>
            <a
              id="header-whatsapp-btn"
              href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup,%20I'd%20like%20to%20book%20an%20appointment%20or%20consult%20about%20my%20bridal%20look.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-2 bg-brand-primary text-brand-bg-primary px-5 py-2 rounded-full font-sans text-xs font-bold shadow-md hover:bg-brand-primary/90 transition-all duration-300 transform hover:-translate-y-0.5 border border-brand-gold/20"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Book Appointment</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              id="header-mobile-ai-btn"
              onClick={onOpenConsultant}
              className="p-2 rounded-full bg-brand-primary/5 text-brand-primary border border-brand-primary/20"
              aria-label="AI Beauty Assistant"
            >
              <Sparkles className="h-4.5 w-4.5 text-brand-gold fill-brand-gold/30 animate-pulse" />
            </button>
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-text-dark hover:text-brand-primary p-1 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <div 
        id="mobile-nav-drawer"
        className={`fixed inset-y-0 left-0 right-0 z-40 bg-brand-bg-secondary/98 backdrop-blur-lg transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between pt-24 pb-8 px-6 shadow-2xl h-screen ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col space-y-5">
          <div className="border-b border-brand-secondary/20 pb-4 mb-2">
            <h3 className="font-serif text-lg text-brand-primary font-bold">{SALON_INFO.name}</h3>
            <p className="text-xs text-brand-text-muted mt-1 font-sans">Indore & Ujjain's Premium Bridal Haven</p>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left font-serif text-xl py-2 tracking-wide border-b border-brand-secondary/10 transition-colors ${
                activeSection === item.id 
                  ? 'text-brand-primary font-bold pl-2 border-l-2 border-brand-primary' 
                  : 'text-brand-text-dark hover:text-brand-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          <button
            id="drawer-ai-btn"
            onClick={() => {
              setIsOpen(false);
              onOpenConsultant();
            }}
            className="flex items-center justify-center space-x-2 w-full py-3 mt-4 rounded-xl bg-brand-primary/5 text-brand-primary border border-brand-primary/30 font-sans text-sm font-semibold hover:bg-brand-primary/10 transition-colors"
          >
            <Sparkles className="h-4.5 w-4.5 text-brand-gold fill-brand-gold/30" />
            <span>AI Bridal & Look Consultant</span>
          </button>
        </div>

        <div className="space-y-4">
          <a
            id="drawer-whatsapp-btn"
            href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup,%20I'd%20like%20to%20book%20an%20appointment%20or%20consult%20about%20my%20bridal%20look.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center space-x-2 bg-brand-primary text-brand-bg-primary py-3 rounded-xl font-sans text-sm font-bold shadow-md w-full"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Book over WhatsApp</span>
          </a>
          {SALON_INFO.contactNumber && (
            <a
              id="drawer-call-btn"
              href={`tel:${SALON_INFO.contactNumber}`}
              className="flex items-center justify-center space-x-2 bg-transparent text-brand-primary py-2.5 rounded-xl border border-brand-primary/30 font-sans text-sm font-semibold w-full"
            >
              <Phone className="h-4 w-4" />
              <span>Call {SALON_INFO.contactNumber}</span>
            </a>
          )}
          <div className="text-center text-[10px] text-brand-text-muted mt-2 font-sans">
            Open daily • {SALON_INFO.hours.weekdays}
          </div>
        </div>
      </div>
    </header>
  );
}
