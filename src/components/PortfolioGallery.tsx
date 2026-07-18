import React, { useState, useEffect, useRef } from 'react';
import { GALLERY_IMAGES, SALON_INFO } from '../data';
import { 
  MessageCircle, 
  ZoomIn, 
  X, 
  ImageIcon, 
  Compass, 
  Upload, 
  Plus, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Trash2,
  Lock,
  Unlock,
  LogOut,
  KeyRound,
  User
} from 'lucide-react';
import { 
  db, 
  storage, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';

interface GalleryItem {
  id?: string;
  title: string;
  category: 'makeup' | 'hair' | 'nails' | 'facials';
  url: string;
  description: string;
  createdAt?: any;
}

export default function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'makeup' | 'hair' | 'nails' | 'facials'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [dynamicImages, setDynamicImages] = useState<GalleryItem[]>([]);
  
  // Admin Mode state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Upload form state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'makeup' | 'hair' | 'nails' | 'facials'>('makeup');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
          createdAt: data.createdAt
        });
      });
      setDynamicImages(items);
    } catch (err) {
      console.error("Error loading custom gallery: ", err);
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

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const envUsername = (import.meta as any).env.VITE_ADMIN_USERNAME || "jayesh soni";
    const envPassword = (import.meta as any).env.VITE_ADMIN_PASSWORD || "jayesh@100";
    
    const normalizedInputUser = adminUsername.trim().toLowerCase();
    const normalizedEnvUser = envUsername.trim().toLowerCase();

    if (normalizedInputUser === normalizedEnvUser && adminPasscode === envPassword) {
      setIsAdmin(true);
      localStorage.setItem('vms_admin_logged_in', 'true');
      setIsAdminLoginOpen(false);
      setAdminUsername('');
      setAdminPasscode('');
      setLoginError(null);
    } else {
      setLoginError("Invalid Admin Name or Password. Please check credentials.");
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

  const allImages = [
    ...dynamicImages,
    ...GALLERY_IMAGES.map(img => ({ ...img, category: img.category as any }))
  ];

  const filteredImages = allImages.filter(
    img => activeFilter === 'all' || img.category === activeFilter
  );

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setUploadError("Please drop an image file (PNG, JPG, JPEG, WEBP)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Dual-mode robust upload handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadTitle.trim() || !uploadDescription.trim()) {
      setUploadError("Please fill out all required fields and upload an image.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    let finalImageUrl = "";

    try {
      // Step 1: Try Firebase Storage upload
      try {
        const storageRef = ref(storage, `portfolio/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      } catch (storageErr) {
        console.warn("Firebase Storage failed or not configured, falling back to secure base64: ", storageErr);
        // Fallback: convert file to a base64 string
        finalImageUrl = imagePreview || "";
      }

      if (!finalImageUrl) {
        throw new Error("Failed to process image data.");
      }

      // Step 2: Save metadata to Firestore
      const newDoc = {
        title: uploadTitle,
        category: uploadCategory,
        url: finalImageUrl,
        description: uploadDescription,
        createdAt: new Date()
      };

      await addDoc(collection(db, 'portfolio_gallery'), newDoc);
      
      setUploadSuccess(true);
      
      // Refresh local dynamic list
      await fetchDynamicGallery();

      // Close modal on success after showing the checkmark
      setTimeout(() => {
        setIsUploadOpen(false);
        // Reset form
        setUploadTitle('');
        setUploadCategory('makeup');
        setUploadDescription('');
        setSelectedFile(null);
        setImagePreview(null);
        setUploadSuccess(false);
        setIsUploading(false);
      }, 1500);

    } catch (error: any) {
      console.error("Upload Error:", error);
      setUploadError(error.message || "An unexpected error occurred during upload. Please try again.");
      setIsUploading(false);
    }
  };

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
                  onClick={() => setIsUploadOpen(true)}
                  className="flex items-center space-x-2 bg-brand-purple text-brand-bg-primary px-5 py-2.5 rounded-full font-sans text-xs font-bold transition-all duration-300 shadow-md hover:shadow-brand-purple/20 hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload Look</span>
                </button>

                <button
                  onClick={handleAdminLogout}
                  className="flex items-center space-x-2 bg-brand-bg-primary text-red-600 hover:bg-red-50 border border-brand-secondary/15 px-4 py-2.5 rounded-full font-sans text-xs font-bold transition-all duration-300 shrink-0"
                  title="Logout Admin"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="flex items-center space-x-1.5 bg-brand-bg-primary text-brand-text-muted border border-brand-secondary/15 px-4 py-2.5 rounded-full font-sans text-xs font-semibold hover:text-brand-primary hover:border-brand-primary/30 transition-all duration-300 shrink-0"
                  title="Admin Access Login"
                >
                  <Lock className="h-3.5 w-3.5 text-brand-purple/80" />
                  <span>Admin Access</span>
                </button>

                <button
                  id="share-look-btn"
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="flex items-center space-x-2 bg-brand-purple/90 text-brand-bg-primary px-5 py-2.5 rounded-full font-sans text-xs font-bold transition-all duration-300 shadow-md hover:shadow-brand-purple/20 hover:scale-[1.02] active:scale-[0.98] shrink-0"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload Real Transformation</span>
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
                {img.id && (
                  <>
                    <div className="absolute top-4 left-4 bg-brand-purple/90 text-brand-bg-primary px-2.5 py-1 rounded-full font-sans text-[9px] font-bold tracking-wider uppercase flex items-center space-x-1 shadow-sm backdrop-blur-xs">
                      <Sparkles className="h-2.5 w-2.5" />
                      <span>Real Client</span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeleteImage(img.id!, e)}
                        className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md backdrop-blur-xs"
                        title="Delete Look"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-brand-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-sans tracking-widest text-brand-purple font-bold">
                        {img.category}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-brand-bg-primary mt-1">
                        {img.title}
                      </h3>
                      <p className="text-[11px] text-brand-bg-primary/80 font-sans mt-1 line-clamp-2">
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
                className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 transition-all z-10 hover:scale-105 active:scale-95"
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
                      <span className="bg-brand-primary/10 text-brand-primary font-sans text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {selectedImage.category}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-brand-primary mt-3 leading-snug">
                        {selectedImage.title}
                      </h3>
                    </div>
                    
                    <p className="font-sans text-xs text-brand-text-muted leading-relaxed">
                      {selectedImage.description}
                    </p>

                    <div className="pt-2 border-t border-brand-secondary/15">
                      <h4 className="font-sans font-bold text-[10px] text-brand-text-dark uppercase tracking-wider">Stylist Notes</h4>
                      <p className="text-[11px] text-brand-text-muted font-sans mt-1">
                        Tailored using skin-tone matching, botanical setting mist, and professional precision tools. Real, unprocessed transformational art.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <a
                      id="modal-whatsapp-booking"
                      href={`https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=Hi%20Vms%20Makeup!%20I%20am%20looking%20at%20your%20portfolio%20and%20absolutely%20love%20the%20"${encodeURIComponent(selectedImage.title)}"%20look.%20I'd%20like%20to%20consult%20and%20book%20this.`}
                      target="_blank"
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

        {/* Admin Login Modal */}
        <AnimatePresence>
          {isAdminLoginOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
              onClick={() => {
                setIsAdminLoginOpen(false);
                setAdminUsername('');
                setAdminPasscode('');
                setLoginError(null);
              }}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="bg-brand-bg-primary rounded-[24px] max-w-md w-full border border-brand-secondary/20 shadow-2xl relative p-6 md:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 rounded-full bg-brand-purple/10 flex items-center justify-center text-brand-purple">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-brand-primary">
                        Salon Administrator
                      </h3>
                      <p className="text-[10px] text-brand-text-muted font-sans uppercase tracking-wider mt-0.5">
                        Secure Authentication Required
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsAdminLoginOpen(false);
                      setAdminUsername('');
                      setAdminPasscode('');
                      setLoginError(null);
                    }}
                    className="text-brand-text-muted hover:text-brand-primary transition-colors p-1 bg-brand-bg-secondary rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-text-dark uppercase tracking-wider mb-2 font-sans">
                      Admin Name
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-text-muted">
                        <User className="h-4 w-4" />
                      </span>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter administrator name"
                        value={adminUsername}
                        onChange={(e) => {
                          setAdminUsername(e.target.value);
                          if (loginError) setLoginError(null);
                        }}
                        className="w-full bg-brand-bg-secondary text-brand-text-dark border border-brand-secondary/15 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple font-sans transition-all"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-brand-text-dark uppercase tracking-wider mb-2 font-sans">
                      Password
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-brand-text-muted">
                        <Lock className="h-4 w-4" />
                      </span>
                      <input 
                        type="password" 
                        required
                        placeholder="Enter administrator password"
                        value={adminPasscode}
                        onChange={(e) => {
                          setAdminPasscode(e.target.value);
                          if (loginError) setLoginError(null);
                        }}
                        className="w-full bg-brand-bg-secondary text-brand-text-dark border border-brand-secondary/15 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple font-sans transition-all"
                      />
                    </div>
                    {loginError && (
                      <p className="text-[11px] text-red-500 font-sans mt-1.5 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3 shrink-0" />
                        <span>{loginError}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-brand-primary text-brand-bg-primary py-3 rounded-xl font-sans text-xs font-bold shadow-md hover:bg-brand-primary/95 transition-all flex items-center justify-center space-x-2"
                    >
                      <Unlock className="h-4 w-4" />
                      <span>Authenticate Access</span>
                    </button>
                  </div>
                </form>

                <p className="text-[10px] text-brand-text-muted font-sans text-center mt-5">
                  Authorized personnel access only. Actions are logged securely.
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Upload Form Modal */}
        <AnimatePresence>
          {isUploadOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto"
              onClick={() => !isUploading && setIsUploadOpen(false)}
            >
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="bg-brand-bg-primary rounded-[24px] max-w-lg w-full border border-brand-secondary/20 shadow-2xl relative p-6 md:p-8 my-8"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-brand-purple uppercase tracking-widest flex items-center gap-1 font-sans">
                      <Sparkles className="h-3 w-3" />
                      Showcase Transformation
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-brand-primary mt-1">
                      Share Your Art
                    </h3>
                  </div>
                  <button
                    onClick={() => !isUploading && setIsUploadOpen(false)}
                    disabled={isUploading}
                    className="text-brand-text-muted hover:text-brand-primary transition-colors p-1 bg-brand-bg-secondary rounded-full disabled:opacity-40"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleUploadSubmit} className="space-y-5">
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text-dark uppercase tracking-wider mb-2 font-sans">
                      Look Title *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Royal Emerald Kundan Glow"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      disabled={isUploading || uploadSuccess}
                      className="w-full bg-brand-bg-secondary text-brand-text-dark border border-brand-secondary/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple font-sans transition-all"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text-dark uppercase tracking-wider mb-2 font-sans">
                      Category *
                    </label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value as any)}
                      disabled={isUploading || uploadSuccess}
                      className="w-full bg-brand-bg-secondary text-brand-text-dark border border-brand-secondary/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple font-sans transition-all"
                    >
                      <option value="makeup">Bridal & Party Make Up</option>
                      <option value="hair">Hair Texturing & Styles</option>
                      <option value="nails">Elite Nail Art</option>
                      <option value="facials">Luxury Skin Glows</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text-dark uppercase tracking-wider mb-2 font-sans">
                      Description *
                    </label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Describe the styling techniques, makeup tones used, hair accessories, or nail overlays."
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                      disabled={isUploading || uploadSuccess}
                      className="w-full bg-brand-bg-secondary text-brand-text-dark border border-brand-secondary/15 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-purple font-sans transition-all resize-none"
                    />
                  </div>

                  {/* File Upload Zone (Supports Drag & Drop + Click Selection) */}
                  <div>
                    <label className="block text-xs font-bold text-brand-text-dark uppercase tracking-wider mb-2 font-sans">
                      Upload Image *
                    </label>
                    
                    {!imagePreview ? (
                      <div 
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                          isDragActive 
                            ? 'border-brand-purple bg-brand-purple/5' 
                            : 'border-brand-secondary/20 hover:border-brand-purple/50 hover:bg-brand-bg-secondary/40'
                        }`}
                      >
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading || uploadSuccess}
                        />
                        <Upload className="h-8 w-8 text-brand-secondary mx-auto mb-2.5 animate-bounce-subtle" />
                        <p className="text-[11px] font-bold text-brand-text-dark font-sans">
                          Drag & drop image or <span className="text-brand-purple underline font-extrabold">browse</span>
                        </p>
                        <p className="text-[9px] text-brand-text-muted mt-1 font-sans">
                          Supports PNG, JPG, JPEG, WEBP up to 8MB
                        </p>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-brand-secondary/15 bg-brand-bg-secondary p-2 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="h-14 w-14 object-cover rounded-lg border border-brand-secondary/10"
                          />
                          <div className="text-left max-w-[200px] truncate">
                            <p className="text-[11px] font-bold text-brand-text-dark font-sans truncate">
                              {selectedFile?.name || "Uploaded Image"}
                            </p>
                            <p className="text-[9px] text-brand-text-muted font-sans">
                              {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeSelectedFile}
                          disabled={isUploading || uploadSuccess}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-all disabled:opacity-40"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Error Prompt */}
                  {uploadError && (
                    <div className="flex items-start gap-2 bg-red-50 text-red-700 text-[11px] p-3.5 rounded-xl border border-red-150 animate-fade-in font-sans">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <p>{uploadError}</p>
                    </div>
                  )}

                  {/* Success Overlay */}
                  {uploadSuccess && (
                    <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 text-[11px] p-3.5 rounded-xl border border-emerald-150 font-sans">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <p className="font-bold">Glow added successfully to portfolio!</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadOpen(false)}
                      disabled={isUploading || uploadSuccess}
                      className="w-1/3 bg-brand-bg-secondary text-brand-text-dark border border-brand-secondary/15 py-3 rounded-xl font-sans text-xs font-bold hover:bg-brand-bg-primary/80 disabled:opacity-50 transition-all"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isUploading || uploadSuccess || !selectedFile}
                      className="w-2/3 bg-brand-primary text-brand-bg-primary py-3 rounded-xl font-sans text-xs font-bold hover:bg-brand-primary/95 transition-all shadow-md flex items-center justify-center space-x-2 disabled:bg-brand-primary/40 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-brand-bg-primary" />
                          <span>Publishing Transformation...</span>
                        </>
                      ) : uploadSuccess ? (
                        <span>Look Added! ✨</span>
                      ) : (
                        <span>Publish Look</span>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

