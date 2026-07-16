import React, { useState } from 'react';
import { REVIEWS_DATA, SALON_INFO } from '../data';
import { Star, Quote, MessageSquare, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? REVIEWS_DATA.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === REVIEWS_DATA.length - 1 ? 0 : prev + 1));
  };

  return (
    <section id="reviews" className="py-20 bg-brand-bg-primary relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />
      
      {/* Soft blur backgrounds */}
      <div className="absolute -left-16 top-1/4 w-72 h-72 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-16 bottom-1/4 w-72 h-72 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="block text-xs font-bold uppercase tracking-widest text-brand-secondary mb-2 font-sans">
            Client Appreciations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-primary">
            Loved Across Indore & Ujjain
          </h2>
          <p className="font-sans text-xs text-brand-text-muted mt-3 italic">
            *Disclaimer: The following are sample testimonials styled to match Google Review structures, illustrating our client-first service quality.
          </p>
        </div>

        {/* Big Review Carousel Card */}
        <div className="relative bg-brand-bg-secondary border border-brand-secondary/15 rounded-[32px] p-8 sm:p-12 shadow-lg max-w-4xl mx-auto">
          
          {/* Quote Icon Background */}
          <div className="absolute top-6 right-8 text-brand-secondary/10">
            <Quote className="h-24 w-24 fill-current rotate-180" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            
            {/* Stars */}
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${
                    i < REVIEWS_DATA[currentIndex].rating 
                      ? 'text-brand-gold fill-brand-gold' 
                      : 'text-brand-secondary/20'
                  }`} 
                />
              ))}
            </div>

            {/* Comment */}
            <p className="font-serif text-lg sm:text-xl lg:text-2xl text-brand-primary italic leading-relaxed max-w-2xl">
              "{REVIEWS_DATA[currentIndex].comment}"
            </p>

            {/* User Details */}
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-brand-primary/15 border border-brand-secondary/30 flex items-center justify-center text-brand-primary font-serif font-bold text-lg shadow-inner uppercase">
                {REVIEWS_DATA[currentIndex].name.charAt(0)}
              </div>
              <h4 className="font-sans font-bold text-sm text-brand-text-dark mt-3">
                {REVIEWS_DATA[currentIndex].name}
              </h4>
              <span className="font-sans text-[11px] text-brand-text-muted mt-0.5">
                Google Verified Review • {REVIEWS_DATA[currentIndex].date}
              </span>
            </div>

          </div>

          {/* Carousel Arrows */}
          <div className="absolute inset-y-0 -left-4 sm:-left-6 flex items-center">
            <button
              onClick={prevReview}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-brand-bg-primary text-brand-primary border border-brand-secondary/15 shadow-md flex items-center justify-center hover:bg-brand-primary hover:text-brand-bg-primary transition-all"
              aria-label="Previous Review"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <div className="absolute inset-y-0 -right-4 sm:-right-6 flex items-center">
            <button
              onClick={nextReview}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-brand-bg-primary text-brand-primary border border-brand-secondary/15 shadow-md flex items-center justify-center hover:bg-brand-primary hover:text-brand-bg-primary transition-all"
              aria-label="Next Review"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* Call to Review CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 bg-brand-bg-secondary p-5 rounded-2xl border border-brand-secondary/10 max-w-2xl mx-auto">
          <div className="text-center sm:text-left">
            <h4 className="font-serif text-sm font-bold text-brand-primary">Already visited {SALON_INFO.name}?</h4>
            <p className="text-[11px] text-brand-text-muted font-sans mt-0.5">Your reviews help us grow in Indore. Share your beauty experience!</p>
          </div>
          <a
            id="write-google-review-btn"
            href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup!%20I'd%20love%20to%20provide%20feedback%20about%20my%20recent%20styling%20session.`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 px-4 py-2 rounded-xl font-sans text-xs font-bold hover:bg-brand-primary hover:text-brand-bg-primary transition-all shrink-0"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Submit Feedback</span>
          </a>
        </div>

      </div>
    </section>
  );
}
