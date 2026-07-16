import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, ShoppingBag, Send, Trash2, Check, ArrowRight, CheckSquare,
  Crown, Diamond, PartyPopper, Wand2, Scissors, Zap, Palette, Wind, Brush, Droplets, Smile, Circle, Droplet, Shield, Feather, Link, Flower2, Activity, Stethoscope, Star, Sun, Hand, Footprints, Flame, Layers, Eye, RotateCcw
} from 'lucide-react';
import { SERVICES_DATA, SALON_INFO } from '../data';

const IconMap: Record<string, React.ElementType> = {
  Crown, Diamond, PartyPopper, Wand2, Sparkles, Scissors, Zap, Palette, Wind, Brush, Droplets, Smile, Circle, Droplet, Shield, Feather, Link, Flower2, Activity, Stethoscope, Star, Sun, Hand, Footprints, Flame, Layers, Eye, Check, RotateCcw, Trash2
};
import { ServiceItem, ServiceCategory } from '../types';

export default function ServicesMenu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Custom Quotation Planner State (Cart of services)
  const [cart, setCart] = useState<ServiceItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Listen to custom category changes triggered from the Bento Grid
  useEffect(() => {
    const handleCategoryChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedCategory(customEvent.detail);
        setSearchTerm(''); // Clear search term so the active category items are visible
      }
    };
    window.addEventListener('changeServiceCategory', handleCategoryChange);
    return () => window.removeEventListener('changeServiceCategory', handleCategoryChange);
  }, []);

  // Toggle items in the consultation wishlist
  const toggleCartItem = (item: ServiceItem) => {
    const exists = cart.find(i => i.id === item.id);
    if (exists) {
      setCart(cart.filter(i => i.id !== item.id));
    } else {
      setCart([...cart, item]);
      setCartOpen(true); // Auto-reveal planner on addition
    }
  };

  const clearCart = () => setCart([]);

  // Generate WhatsApp text based on selected services
  const getWhatsAppLink = () => {
    const listText = cart.map((item, index) => `${index + 1}. ${item.name} (${item.category})`).join('\n');
    const intro = `Hi Vmsmakeup! I am visiting your website and would like to consult or book a session for the following services:\n\n${listText}\n\nPlease let me know the availability and pricing details. Thank you!`;
    return `https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(intro)}`;
  };

  // Filter items based on category and search query
  const filteredCategories = SERVICES_DATA.map(category => {
    const items = category.items.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return { ...category, items };
  }).filter(category => 
    (selectedCategory === 'all' || category.id === selectedCategory) && 
    category.items.length > 0
  );

  return (
    <section id="services" className="py-20 bg-brand-bg-primary relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="block text-xs font-bold uppercase tracking-widest text-brand-secondary mb-2 font-sans">
            Our Service Offerings
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-primary">
            Luxury Indulgences, Tailored For You
          </h2>
          <p className="font-sans text-sm sm:text-base text-brand-text-muted mt-4">
            Select and add services to your personal Beauty Consultation Cart to instantly draft a custom appointment booking over WhatsApp.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-brand-bg-secondary p-4 rounded-2xl border border-brand-secondary/15 shadow-sm">
          {/* Quick Category Buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-sans text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-brand-primary text-brand-bg-primary shadow-sm'
                  : 'bg-brand-bg-primary text-brand-text-muted hover:text-brand-primary border border-brand-secondary/10'
              }`}
            >
              All Services
            </button>
            {SERVICES_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-sans text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-primary text-brand-bg-primary shadow-sm'
                    : 'bg-brand-bg-primary text-brand-text-muted hover:text-brand-primary border border-brand-secondary/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-text-muted" />
            <input
              type="text"
              placeholder="Search services (e.g. Keratin)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-brand-bg-primary border border-brand-secondary/20 rounded-xl py-2 pl-9 pr-4 font-sans text-xs text-brand-text-dark placeholder-brand-text-muted focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* Services List Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Services Accordions/Cards */}
          <div className={`space-y-12 transition-all duration-300 ${cart.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-brand-bg-secondary rounded-[24px] p-6 sm:p-8 border border-brand-secondary/15 shadow-sm">
                
                {/* Category Header */}
                {(() => {
                  const CategoryIcon = category.iconName && IconMap[category.iconName] ? IconMap[category.iconName] : Sparkles;
                  return category.imageUrl ? (
                    <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden mb-8 relative border border-brand-secondary/10">
                      <img 
                        src={category.imageUrl} 
                        alt={category.name} 
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-secondary via-brand-bg-secondary/40 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 right-4 flex items-end sm:items-center space-x-4">
                        <div className="h-12 w-12 sm:h-14 sm:w-14 bg-brand-bg-primary rounded-xl flex items-center justify-center text-brand-primary shadow-xl shrink-0">
                          <CategoryIcon className="h-6 w-6 sm:h-7 sm:w-7 text-brand-gold" />
                        </div>
                        <div className="pb-1 sm:pb-0 max-w-lg">
                          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-brand-primary drop-shadow-sm">{category.name}</h3>
                          <p className="text-xs sm:text-sm text-brand-text-dark font-sans mt-1.5 drop-shadow-sm font-medium leading-relaxed">{category.description}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3 mb-6 border-b border-brand-secondary/15 pb-4">
                      <div className="h-10 w-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary shrink-0">
                        <CategoryIcon className="h-5 w-5 text-brand-gold" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-brand-primary">{category.name}</h3>
                        <p className="text-[11px] text-brand-text-muted mt-0.5">{category.description}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Items Grid */}
                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                  {category.items.map((item) => {
                    const isSelected = cart.some(i => i.id === item.id);
                    const ServiceIcon = item.iconName && IconMap[item.iconName] ? IconMap[item.iconName] : Sparkles;

                    return (
                      <div 
                        key={item.id} 
                        className={`flex flex-col justify-between p-4 rounded-xl border transition-all duration-300 relative group overflow-hidden ${
                          isSelected 
                            ? 'bg-brand-primary/5 border-brand-primary/40 shadow-sm' 
                            : 'bg-brand-bg-primary hover:bg-brand-bg-secondary border-brand-secondary/10 hover:border-brand-secondary/25 hover:shadow-sm'
                        }`}
                      >
                        {/* Background subtle watermark icon */}
                        <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none transition-transform duration-500 group-hover:scale-110 z-0">
                          <ServiceIcon size={120} strokeWidth={1} />
                        </div>

                        {item.isPremium && (
                          <div className="absolute top-0 right-0 bg-brand-gold text-brand-bg-primary text-[8px] font-sans font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wide z-10">
                            Signature Offer
                          </div>
                        )}
                        
                        <div className="relative z-10">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-8 w-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-brand-bg-primary transition-colors">
                              <ServiceIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-serif text-base font-bold text-brand-primary pr-8 leading-tight">
                                {item.name}
                              </h4>
                              {item.description && (
                                <p className="text-xs text-brand-text-muted font-sans mt-1.5 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card bottom block */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-secondary/5">
                          <span className="font-sans text-[11px] font-bold text-brand-secondary">
                            {item.price || "Price on request via WhatsApp"}
                          </span>
                          
                          <button
                            id={`add-service-${item.id}`}
                            onClick={() => toggleCartItem(item)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-sans text-[10px] font-bold transition-all ${
                              isSelected 
                                ? 'bg-brand-primary text-brand-bg-primary' 
                                : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-brand-bg-primary'
                            }`}
                          >
                            {isSelected ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>Selected</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-3 w-3" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12 bg-brand-bg-secondary rounded-2xl border border-brand-secondary/15">
                <p className="font-sans text-sm text-brand-text-muted">No services found matching your query.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }} 
                  className="font-sans text-xs font-bold text-brand-primary mt-3 underline"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Custom Quotation Cart */}
          {cart.length > 0 && (
            <div className="lg:col-span-4 sticky top-24 bg-brand-bg-secondary rounded-[24px] p-6 border border-brand-primary/20 shadow-xl flex flex-col space-y-4">
              <div className="flex items-center justify-between border-b border-brand-secondary/20 pb-3">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5 text-brand-secondary" />
                  <h3 className="font-serif text-lg font-bold text-brand-primary">Consultation Cart</h3>
                </div>
                <span className="bg-brand-primary text-brand-bg-primary px-2 py-0.5 rounded-full font-sans text-xs font-bold">
                  {cart.length}
                </span>
              </div>

              <p className="text-[11px] text-brand-text-muted font-sans leading-relaxed">
                Review your luxury checklist. Click below to chat directly with our Indore specialists with these pre-filled details.
              </p>

              {/* Wishlist Items List */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-brand-bg-primary p-2.5 rounded-xl border border-brand-secondary/10">
                    <div className="text-left pr-2">
                      <h5 className="font-sans font-semibold text-xs text-brand-text-dark truncate max-w-[160px]">{item.name}</h5>
                      <span className="text-[9px] text-brand-text-muted font-sans">{item.category}</span>
                    </div>
                    <button 
                      id={`remove-service-${item.id}`}
                      onClick={() => toggleCartItem(item)}
                      className="text-brand-text-muted hover:text-red-600 p-1 transition-colors"
                      aria-label="Remove Service"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Bottom CTAs */}
              <div className="pt-3 border-t border-brand-secondary/20 space-y-2">
                <a
                  id="cart-whatsapp-submit-btn"
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 w-full bg-brand-primary text-brand-bg-primary py-3 rounded-xl font-sans text-xs font-bold shadow-md hover:bg-brand-primary/95 transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>Send WhatsApp Inquiry</span>
                </a>
                
                <button
                  id="cart-clear-btn"
                  onClick={clearCart}
                  className="w-full text-center py-2 font-sans text-[10px] font-semibold text-brand-text-muted hover:text-brand-primary transition-colors"
                >
                  Clear Checklist
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
