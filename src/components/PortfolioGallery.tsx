import React, { useState, useEffect } from 'react';
import { GALLERY_IMAGES, SALON_INFO } from '../data';
import { 
  MessageCircle, 
  ZoomIn, 
  X, 
  ImageIcon, 
  Plus, 
  Sparkles, 
  Trash2,
  Lock,
  Unlock,
  LogOut
} from 'lucide-react';
import { 
  db, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy 
} from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryItem {
  id?: string;
  title: string;
  category: 'makeup' | 'hair' | 'nails' | 'facials';
  url: string;
  description: string;
  createdAt?: any;
  isPreset?: boolean;
}

export default function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'makeup' | 'hair' | 'nails' | 'facials'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [dynamicImages, setDynamicImages] = useState<GalleryItem[]>([]);
  
  // Admin Mode state (used to render inline delete buttons on the gallery page for admin session)
  const [isAdmin, setIsAdmin] = useState(false);

  const filters = [
    { id: 'all', label: 'All Portfolio' },
    { id: 'makeup', label: 'Bridal & Party Make Up' },
    { id: 'hair', label: 'Hair Texturing & Styles' },
    { id: 'nails', label: 'Elite Nail Art' },
    { id: 'facials', label: 'Luxury Skin Glows' }
  ] as const;

  // Fetch custom uploaded images from Firestore
  const fetchDynamicGallery = async () => {
    try {
      const { doc: getFirestoreDoc, getDoc, setDoc } = await import('firebase/firestore');
      const stateDocRef = getFirestoreDoc(db, 'gallery_config', 'state');
      const stateDocSnap = await getDoc(stateDocRef);
      const isInitialized = stateDocSnap.exists() && stateDocSnap.data()?.initialized === true;

      if (!isInitialized && GALLERY_IMAGES.length > 0) {
        console.log("Initializing Firestore with default preset gallery images...");
        for (let i = 0; i < GALLERY_IMAGES.length; i++) {
          const preset = GALLERY_IMAGES[i];
          await addDoc(collection(db, 'portfolio_gallery'), {
            title: preset.title,
            category: preset.category,
            url: preset.url,
            description: preset.description,
            isPreset: true,
            createdAt: new Date(Date.now() - (i * 10000)) // maintain order
          });
        }
        await setDoc(stateDocRef, { initialized: true });
        console.log("Firestore initialization complete.");
      }

      const q = query(collection(db, 'portfolio_gallery'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const items: GalleryItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title,
          category: data.category,
          url: data.url,
          description: data.description,
          isPreset: data.isPreset || false,
          createdAt: data.createdAt
        });
      });
      setDynamicImages(items);
    } catch (err) {
      console.error("Error loading custom gallery: ", err);
      // Fallback to local presets if database load fails
      setDynamicImages(GALLERY_IMAGES.map((img, idx) => ({
        id: `fallback-${idx}`,
        title: img.title,
        category: img.category as any,
        url: img.url,
        description: img.description,
        isPreset: true
      })));
    }
  };

  const handleDeleteImage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the full image lightbox modal
    if (!isAdmin) {
      alert("Only authenticated salon administrators are authorized to delete looks.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this custom look completely?")) {
      return;
    }
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'portfolio_gallery', id));
      // Instantly remove from local UI state
      setDynamicImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error("Failed to delete image from database:", err);
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

  const handleAdminLogout = () => {
    if (window.confirm("Are you sure you want to sign out of Admin Mode?")) {
      setIsAdmin(false);
      localStorage.removeItem('vms_admin_logged_in');
    }
  };

  useEffect(() => {
    fetchDynamicGallery();
    const storedAdmin = localStorage.getItem('vms_admin_logged_in');
    if (storedAdmin === 'true') {
      setIsAdmin(true);
    }
  }, []);

  // Lock background scroll when an image is selected to prevent losing scroll position
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedImage]);

  const allImages = dynamicImages;

  const filteredImages = allImages.filter(
    img => activeFilter === 'all' || img.category === activeFilter
  );



  return (
    <section id="gallery" className="py-20 bg-brand-bg-secondary relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-secondary/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="block text-xs font-bold uppercase tracking-widest text-brand-secondary mb-2 font-sans">
            Our Master Portfolio
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-primary">
            A Testament to Divine Beauty
          </h2>
          <p className="font-sans text-sm sm:text-base text-brand-text-muted mt-4">
            Real finished outcomes of our Indian bridal makeups, premium hair styling, and meticulous nail art. No over-processed stock photos — only pure, raw craft.
          </p>
        </div>

        {/* Filter Navigation & Upload Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 border-b border-brand-secondary/10 pb-6">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-2.5 rounded-full font-sans text-xs font-semibold transition-all duration-300 ${
                  activeFilter === filter.id
                    ? 'bg-brand-primary text-brand-bg-primary shadow-md'
                    : 'bg-brand-bg-primary text-brand-text-muted border border-brand-secondary/15 hover:text-brand-primary hover:border-brand-primary/30'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin ? (
              <>
                <div className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-sans text-[10px] font-bold uppercase tracking-wider">
                  <Unlock className="h-3 w-3 text-emerald-500" />
                  <span>Admin Mode Active</span>
                </div>
                
                <button
                  id="share-look-btn"
                  onClick={() => (window as any).navigateToPath('/admin')}
                  className="flex items-center space-x-2 bg-brand-purple text-brand-bg-primary px-5 py-2.5 rounded-full font-sans text-xs font-bold transition-all duration-300 shadow-md hover:shadow-brand-purple/20 hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Admin Console</span>
                </button>

                <button
                  onClick={handleAdminLogout}
                  className="flex items-center space-x-2 bg-brand-bg-primary text-red-600 hover:bg-red-50 border border-brand-secondary/15 px-4 py-2.5 rounded-full font-sans text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer"
                  title="Logout Admin"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => (window as any).navigateToPath('/admin')}
                  className="flex items-center space-x-1.5 bg-brand-bg-primary text-brand-text-muted border border-brand-secondary/15 px-4 py-2.5 rounded-full font-sans text-xs font-semibold hover:text-brand-primary hover:border-brand-primary/30 transition-all duration-300 shrink-0 cursor-pointer"
                  title="Admin Access Login"
                >
                  <Lock className="h-3.5 w-3.5 text-brand-purple/80" />
                  <span>Admin Access</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Portfolio Grid */}
        <motion.div 
          layout
          className="grid gap-6" 
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                key={img.id || `preset-${idx}`}
                className="group relative aspect-square bg-brand-bg-primary rounded-[20px] overflow-hidden shadow-md border border-brand-secondary/10 cursor-pointer"
                onClick={() => setSelectedImage(img)}
              >
                {/* Image */}
                <img 
                  src={img.url} 
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Badge for dynamically uploaded items */}
                {img.id && !img.isPreset && (
                  <div className="absolute top-4 left-4 bg-brand-purple/90 text-brand-bg-primary px-2.5 py-1 rounded-full font-sans text-xs font-bold tracking-wider uppercase flex items-center space-x-1 shadow-sm backdrop-blur-xs">
                    <Sparkles className="h-2.5 w-2.5" />
                    <span>Real Client</span>
                  </div>
                )}
                {isAdmin && img.id && (
                  <button
                    onClick={(e) => handleDeleteImage(img.id!, e)}
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md backdrop-blur-xs cursor-pointer"
                    title="Delete Look"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-brand-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-start justify-between">
                    <div>
                      <span className="text-xs uppercase font-sans tracking-widest text-brand-purple font-bold">
                        {img.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-brand-bg-primary mt-1">
                        {img.title}
                      </h3>
                      <p className="text-xs text-brand-bg-primary/80 font-sans mt-1 line-clamp-2">
                        {img.description}
                      </p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-brand-bg-primary flex items-center justify-center text-brand-primary shrink-0 ml-2 shadow-md">
                      <ZoomIn className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state when no images */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16 bg-brand-bg-primary rounded-[24px] border border-brand-secondary/10 mt-6">
            <ImageIcon className="h-10 w-10 text-brand-secondary/35 mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-brand-primary">No Images Found</p>
            <p className="font-sans text-xs text-brand-text-muted mt-1">Be the first to share a look in this category!</p>
          </div>
        )}

        {/* Image Viewer / Lightbox Modal */}
        {selectedImage && (
          <div 
            id="gallery-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="bg-brand-bg-primary rounded-[24px] overflow-hidden max-w-2xl w-full border border-brand-secondary/20 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="close-gallery-modal"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all z-10 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="md:col-span-7 aspect-square relative bg-brand-bg-secondary flex items-center justify-center">
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="md:col-span-5 p-6 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div>
                      <span className="bg-brand-primary/10 text-brand-primary font-sans text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {selectedImage.category}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-brand-primary mt-3 leading-snug">
                        {selectedImage.title}
                      </h3>
                    </div>
                    
                    <p className="font-sans text-sm text-brand-text-muted leading-relaxed">
                      {selectedImage.description}
                    </p>

                    <div className="pt-2 border-t border-brand-secondary/15">
                      <h4 className="font-sans font-bold text-xs text-brand-text-dark uppercase tracking-wider">Stylist Notes</h4>
                      <p className="text-sm text-brand-text-muted font-sans mt-1">
                        Tailored using skin-tone matching, botanical setting mist, and professional precision tools. Real, unprocessed transformational art.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <a
                      id="modal-whatsapp-booking"
                      href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup!%20I%20am%20looking%20at%20your%20portfolio%20and%20absolutely%20love%20the%20"${encodeURIComponent(selectedImage.title)}"%20look.%20I'd%20like%20to%20consult%20and%20book%20this.`}
                      target="_blank"
                      onClick={handleBookingClick}
                      rel="noreferrer"
                      className="flex items-center justify-center space-x-2 w-full bg-brand-primary text-brand-bg-primary py-3 rounded-xl font-sans text-xs font-bold shadow-md hover:bg-brand-primary/95 transition-all"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Book this Look</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

