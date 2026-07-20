import React from 'react';
import { SALON_INFO } from '../data';
import { Award, Heart, CheckCircle2, ShieldCheck, Compass } from 'lucide-react';
import aboutBride from '../assets/images/about_bride_main.jpg';

interface AboutAndStoryProps {
  salonInfo?: {
    heroTitle: string;
    aboutStory: string;
  };
}

export default function AboutAndStory({ salonInfo }: AboutAndStoryProps) {
  const brandPillars = [
    {
      icon: <Award className="h-6 w-6 text-brand-gold" />,
      title: "Master Artistry",
      desc: "Our stylists hold certifications in advanced hair texture engineering and bridal contouring."
    },
    {
      icon: <Heart className="h-6 w-6 text-brand-gold" />,
      title: "Women-First Sanctuary",
      desc: "An absolutely hygienic, relaxing, and comforting environment for complete body rejuvenation."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-gold" />,
      title: "5-Star Spa Standards",
      desc: "We use strictly dermatologically approved serums, safe heat-protectors, and premium organic oils."
    },
    {
      icon: <Compass className="h-6 w-6 text-brand-gold" />,
      title: "Ujjain & Indore Trust",
      desc: "Located in Scheme 54, Indore and Freegunj, Ujjain — trusted across MP for wedding lookups."
    }
  ];

  return (
    <section id="about" className="py-20 bg-brand-bg-secondary relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Visual Storyboard */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-[32px] overflow-hidden border-4 border-brand-bg-primary shadow-xl">
              <img 
                src={aboutBride} 
                alt="Hair Styling Rituals at Vmsmakeup"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Year overlay tag */}
              <div className="absolute top-4 left-4 bg-brand-primary text-brand-bg-primary px-4 py-2 rounded-2xl border border-brand-gold/30 shadow-md flex flex-col items-center">
                <span className="font-serif text-xl font-bold">4+</span>
                <span className="font-sans text-[8px] uppercase tracking-wider font-semibold">Years Trust</span>
              </div>
            </div>

            {/* Decorative background outline */}
            <div className="absolute -bottom-6 -left-6 w-1/2 aspect-square bg-brand-gold/10 rounded-[24px] blur-2xl -z-0" />
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 text-left space-y-6">
            <span className="block text-xs font-bold uppercase tracking-widest text-brand-secondary font-sans">
              Discover Vmsmakeup
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-primary">
              Where Local Warmth Meets 5-Star Spa Excellence
            </h2>
            
            <p className="font-sans text-xs sm:text-sm text-brand-text-muted leading-relaxed">
              {salonInfo?.aboutStory || SALON_INFO.aboutStory}
            </p>

            {/* Core Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {brandPillars.map((pillar, idx) => (
                <div 
                  key={idx}
                  className="bg-brand-bg-primary p-4 rounded-2xl border border-brand-secondary/10 flex items-start space-x-3.5 hover:shadow-sm transition-shadow"
                >
                  <div className="h-10 w-10 bg-brand-primary/5 rounded-xl flex items-center justify-center shrink-0 border border-brand-secondary/15">
                    {pillar.icon}
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-xs text-brand-text-dark">{pillar.title}</h4>
                    <p className="text-[10px] text-brand-text-muted font-sans mt-0.5 leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
