import React, { useState, useEffect, useRef } from 'react';
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
import { doc as getFirestoreDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
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
  User, 
  ArrowLeft, 
  Image as ImageIcon, 
  Grid, 
  ExternalLink
} from 'lucide-react';

interface GalleryItem {
  id?: string;
  title: string;
  category: 'makeup' | 'hair' | 'nails' | 'facials';
  url: string;
  description: string;
  createdAt?: any;
  isPreset?: boolean;
}

interface AdminPanelProps {
  onNavigateHome: () => void;
  salonInfo?: {
    heroTitle: string;
    aboutStory: string;
  };
  onUpdateSalonInfo?: (updatedInfo: { heroTitle: string; aboutStory: string }) => void;
}

export default function AdminPanel({ onNavigateHome, salonInfo, onUpdateSalonInfo }: AdminPanelProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Editable Text Config states
  const [heroTitleInput, setHeroTitleInput] = useState(salonInfo?.heroTitle || "Best Bridal Makeup Studio Ujjain & Indore");
  const [aboutStoryInput, setAboutStoryInput] = useState(salonInfo?.aboutStory || "");
  const [updatingTextConfig, setUpdatingTextConfig] = useState(false);
  const [textConfigSuccess, setTextConfigSuccess] = useState(false);
  const [textConfigError, setTextConfigError] = useState("");
  const [activeTab, setActiveTab] = useState<'post' | 'textConfig'>('post');

  useEffect(() => {
    if (salonInfo) {
      setHeroTitleInput(salonInfo.heroTitle);
      setAboutStoryInput(salonInfo.aboutStory);
    }
  }, [salonInfo]);
  // Gallery items management
  const [dynamicImages, setDynamicImages] = useState<GalleryItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);

  // Upload form state
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

  // Check login status on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('vms_admin_logged_in');
    if (storedAdmin === 'true') {
      setIsAdmin(true);
      fetchGallery();
    }
  }, []);

  const fetchGallery = async () => {
    setIsLoadingGallery(true);
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
          isPreset: data.isPreset || false,
          createdAt: data.createdAt
        });
      });
      setDynamicImages(items);
    } catch (err) {
      console.error("Error loading gallery for admin: ", err);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const handleUpdateTextConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingTextConfig(true);
    setTextConfigSuccess(false);
    setTextConfigError("");

    try {
      const { doc, setDoc } = await import('firebase/firestore');
      const docRef = doc(db, 'salon_config', 'info');
      await setDoc(docRef, {
        heroTitle: heroTitleInput,
        aboutStory: aboutStoryInput,
        updatedAt: new Date()
      }, { merge: true });

      if (onUpdateSalonInfo) {
        onUpdateSalonInfo({
          heroTitle: heroTitleInput,
          aboutStory: aboutStoryInput
        });
      }
      setTextConfigSuccess(true);
      setTimeout(() => {
        setTextConfigSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error("Failed to update salon config: ", err);
      setTextConfigError(err.message || "An error occurred while updating settings.");
    } finally {
      setUpdatingTextConfig(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    const normalizedInputUser = adminUsername.trim().toLowerCase().replace(/\s+/g, '_');

    try {
      const credentialDocRef = getFirestoreDoc(db, 'admin_credentials', normalizedInputUser);
      const credentialSnap = await getDoc(credentialDocRef);

      if (credentialSnap.exists()) {
        const data = credentialSnap.data();
        if (data.passcode === adminPasscode) {
          setIsAdmin(true);
          localStorage.setItem('vms_admin_logged_in', 'true');
          setAdminUsername('');
          setAdminPasscode('');
          fetchGallery();
          setIsLoggingIn(false);
          return;
        }
      }
      
      // Fallback matching environment variables configuration
      const envUsername = "jayesh soni";
      const envPassword = "jayesh@100";
      if (adminUsername.trim().toLowerCase() === envUsername && adminPasscode === envPassword) {
        setIsAdmin(true);
        localStorage.setItem('vms_admin_logged_in', 'true');
        setAdminUsername('');
        setAdminPasscode('');
        fetchGallery();
        setIsLoggingIn(false);
        return;
      }

      setLoginError("Invalid Administrator credentials.");
    } catch (err) {
      console.error("Login verification failed: ", err);
      // Hard fallback
      const envUsername = "jayesh soni";
      const envPassword = "jayesh@100";
      if (adminUsername.trim().toLowerCase() === envUsername && adminPasscode === envPassword) {
        setIsAdmin(true);
        localStorage.setItem('vms_admin_logged_in', 'true');
        setAdminUsername('');
        setAdminPasscode('');
        fetchGallery();
      } else {
        setLoginError("Connection failed. Check admin credentials.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = () => {
    if (window.confirm("Are you sure you want to sign out of the Admin panel?")) {
      setIsAdmin(false);
      localStorage.removeItem('vms_admin_logged_in');
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this custom look completely from the portfolio?")) {
      return;
    }
    try {
      await deleteDoc(getFirestoreDoc(db, 'portfolio_gallery', id));
      setDynamicImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error("Failed to delete image: ", err);
      alert("Failed to delete this look. Please check Firestore permissions.");
    }
  };

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
        setUploadError("Please drop a valid image file (PNG, JPG, JPEG, WEBP)");
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

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !uploadTitle.trim() || !uploadDescription.trim()) {
      setUploadError("Please fill out all fields and select an image.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    let finalImageUrl = "";

    try {
      // 1. Try Firebase Storage upload
      try {
        const storageRef = ref(storage, `portfolio/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      } catch (storageErr) {
        console.warn("Storage failed, falling back to base64 encoding: ", storageErr);
        finalImageUrl = imagePreview || "";
      }

      if (!finalImageUrl) {
        throw new Error("Unable to parse or upload image data.");
      }

      // 2. Add metadata document to Firestore
      const newDoc = {
        title: uploadTitle,
        category: uploadCategory,
        url: finalImageUrl,
        description: uploadDescription,
        createdAt: new Date(),
        isPreset: false
      };

      await addDoc(collection(db, 'portfolio_gallery'), newDoc);
      
      setUploadSuccess(true);
      fetchGallery();

      // Reset form on success
      setTimeout(() => {
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
      setUploadError(error.message || "An error occurred while uploading. Please try again.");
      setIsUploading(false);
    }
  };

  // Get total stats
  const totalLooks = dynamicImages.length;
  const countByCategory = (cat: string) => dynamicImages.filter(img => img.category === cat).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-brand-primary/20 selection:text-brand-primary relative overflow-hidden">
      {/* Visual background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none" />

      {!isAdmin ? (
        /* ==================== LOGIN SCREEN ==================== */
        <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Header branding */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 text-[10px] font-bold uppercase tracking-wider mb-3">
                <Lock className="h-3 w-3" />
                <span>Secure Console</span>
              </span>
              <h1 className="font-serif text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-400">
                Vms Makeup
              </h1>
              <p className="text-xs text-neutral-400 mt-1 font-sans tracking-wide">
                Salon Administration Portal
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-widest mb-2 font-sans">
                  Administrator Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter admin username"
                    value={adminUsername}
                    onChange={(e) => {
                      setAdminUsername(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    className="w-full bg-neutral-950/60 text-neutral-100 border border-neutral-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary/30 font-sans transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-widest mb-2 font-sans">
                  Access Passcode / Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                    <KeyRound className="h-4.5 w-4.5" />
                  </span>
                  <input 
                    type="password" 
                    required
                    placeholder="Enter access code"
                    value={adminPasscode}
                    onChange={(e) => {
                      setAdminPasscode(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    className="w-full bg-neutral-950/60 text-neutral-100 border border-neutral-800 rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary/30 font-sans transition-all"
                  />
                </div>
                {loginError && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-rose-500 font-sans mt-2.5 flex items-center gap-1.5"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{loginError}</span>
                  </motion.div>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-brand-primary hover:bg-brand-primary/95 text-white py-3.5 rounded-2xl font-sans text-sm font-bold shadow-lg hover:shadow-brand-primary/20 transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin animate-duration-1000" />
                      <span>Verifying Authority...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4.5 w-4.5" />
                      <span>Authenticate Portal</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Back Button */}
            <div className="mt-8 pt-6 border-t border-neutral-800/60 text-center">
              <button
                onClick={onNavigateHome}
                className="inline-flex items-center space-x-1 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Public Website</span>
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        /* ==================== ADMIN DASHBOARD ==================== */
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-neutral-800 pb-8 mb-10">
            <div>
              <div className="flex items-center space-x-2.5">
                <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-sans">
                  Active Admin Console
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-1">
                Workspace Dashboard
              </h1>
              <p className="text-xs text-neutral-400 mt-1 font-sans">
                Manage your master salon portfolio and post live client transformations
              </p>
            </div>

            <div className="flex items-center space-x-3 self-start md:self-center">
              <button
                onClick={onNavigateHome}
                className="flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 px-4 py-2.5 rounded-2xl font-sans text-xs font-semibold transition-all shrink-0 cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>View Website</span>
              </button>
              <button
                onClick={handleAdminLogout}
                className="flex items-center space-x-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white px-4 py-2.5 rounded-2xl font-sans text-xs font-bold transition-all shrink-0 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Total Looks</span>
                <Grid className="h-4 w-4 text-brand-primary" />
              </div>
              <p className="text-2xl font-bold text-white font-sans">{totalLooks}</p>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Makeup</span>
                <Sparkles className="h-4 w-4 text-brand-purple" />
              </div>
              <p className="text-2xl font-bold text-white font-sans">{countByCategory('makeup')}</p>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Hair Stylings</span>
                <Sparkles className="h-4 w-4 text-brand-secondary" />
              </div>
              <p className="text-2xl font-bold text-white font-sans">{countByCategory('hair')}</p>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4 text-left">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Nail Art</span>
                <Sparkles className="h-4 w-4 text-teal-400" />
              </div>
              <p className="text-2xl font-bold text-white font-sans">{countByCategory('nails')}</p>
            </div>
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4 text-left col-span-2 md:col-span-1">
              <div className="flex items-center justify-between text-neutral-400 mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Skin Glows</span>
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-white font-sans">{countByCategory('facials')}</p>
            </div>
          </div>

          {/* Main Dashboard Workspace split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Add New Transformation Look (Image Posting Form) */}
            <div className="lg:col-span-5 bg-neutral-900/60 backdrop-blur-md border border-neutral-800 rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.02]">
                <Upload className="h-24 w-24 text-white" />
              </div>

              {/* Tab Selector */}
              <div className="flex border-b border-neutral-800 mb-6">
                <button
                  type="button"
                  onClick={() => setActiveTab('post')}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider font-sans transition-all border-b-2 ${
                    activeTab === 'post' 
                      ? 'border-brand-primary text-white font-semibold' 
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Post Look
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('textConfig')}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider font-sans transition-all border-b-2 ${
                    activeTab === 'textConfig' 
                      ? 'border-brand-primary text-white font-semibold' 
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  Edit Site Text
                </button>
              </div>

              {activeTab === 'post' ? (
                <>
                  <h2 className="font-serif text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <Plus className="h-5.5 w-5.5 text-brand-primary" />
                    <span>Post Transformation</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mb-6 font-sans">
                    Post high-resolution images of your real clients to showcase on the main portfolio.
                  </p>

                  <form onSubmit={handleUploadSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2 font-sans">
                        Look Title *
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Royal Rajasthani Bridal Glow"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        disabled={isUploading || uploadSuccess}
                        className="w-full bg-neutral-950/60 text-white border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary font-sans transition-all"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2 font-sans">
                        Category Type *
                      </label>
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value as any)}
                        disabled={isUploading || uploadSuccess}
                        className="w-full bg-neutral-950/60 text-white border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary font-sans transition-all"
                      >
                        <option value="makeup">Bridal & Party Make Up</option>
                        <option value="hair">Hair Texturing & Styles</option>
                        <option value="nails">Elite Nail Art</option>
                        <option value="facials">Luxury Skin Glows</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2 font-sans">
                        Transformation Details *
                      </label>
                      <textarea 
                        required
                        rows={4}
                        placeholder="Describe the makeup brand, shade details, hair accessories, or specific client skin prep techniques."
                        value={uploadDescription}
                        onChange={(e) => setUploadDescription(e.target.value)}
                        disabled={isUploading || uploadSuccess}
                        className="w-full bg-neutral-950/60 text-white border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary font-sans transition-all resize-none"
                      />
                    </div>

                    {/* File Drop Area */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2 font-sans">
                        Client Transformation Photo *
                      </label>
                      
                      {!imagePreview ? (
                        <div 
                          onDragEnter={handleDrag}
                          onDragOver={handleDrag}
                          onDragLeave={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                            isDragActive 
                              ? 'border-brand-primary bg-brand-primary/5' 
                              : 'border-neutral-800 hover:border-brand-primary/50 hover:bg-neutral-800/30'
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
                          <Upload className="h-9 w-9 text-neutral-500 mx-auto mb-3" />
                          <p className="text-xs font-bold text-neutral-300 font-sans">
                            Drag & drop client image or <span className="text-brand-primary underline font-extrabold">browse file</span>
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-1 font-sans">
                            Supports PNG, JPG, JPEG, WEBP up to 8MB
                          </p>
                        </div>
                      ) : (
                        <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 p-2.5 flex items-center justify-between">
                          <div className="flex items-center space-x-3.5">
                            <img 
                              src={imagePreview} 
                              alt="Preview" 
                              className="h-16 w-16 object-cover rounded-xl border border-neutral-800"
                            />
                            <div className="text-left max-w-[180px] truncate">
                              <p className="text-xs font-bold text-neutral-200 font-sans truncate font-sans">
                                {selectedFile?.name || "Uploaded Image"}
                              </p>
                              <p className="text-[10px] text-neutral-500 font-sans mt-0.5 font-sans">
                                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ""}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={removeSelectedFile}
                            disabled={isUploading || uploadSuccess}
                            className="text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 p-2 rounded-full transition-all disabled:opacity-40 cursor-pointer"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Feedback Alerts */}
                    {uploadError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2.5 bg-rose-500/10 text-rose-400 text-xs p-4 rounded-2xl border border-rose-500/20 font-sans"
                      >
                        <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                        <p>{uploadError}</p>
                      </motion.div>
                    )}

                    {uploadSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs p-4 rounded-2xl border border-emerald-500/20 font-sans"
                      >
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                        <p className="font-bold">Look uploaded successfully!</p>
                      </motion.div>
                    )}

                    {/* Submit Actions */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isUploading || uploadSuccess || !selectedFile}
                        className="w-full bg-brand-primary text-white py-3.5 rounded-2xl font-sans text-xs font-bold hover:bg-brand-primary/95 transition-all shadow-lg hover:shadow-brand-primary/10 flex items-center justify-center space-x-2 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            <span>Publishing to Live Site...</span>
                          </>
                        ) : uploadSuccess ? (
                          <span>Published ✨</span>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            <span>Publish Look</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <Sparkles className="h-5.5 w-5.5 text-brand-primary" />
                    <span>Site Text Settings</span>
                  </h2>
                  <p className="text-xs text-neutral-400 mb-6 font-sans">
                    Edit the main titles and descriptions displayed on your public salon website sections.
                  </p>

                  <form onSubmit={handleUpdateTextConfig} className="space-y-5">
                    {/* Hero Title */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2 font-sans">
                        Hero Section Headline *
                      </label>
                      <input 
                        type="text" 
                        required
                        value={heroTitleInput}
                        onChange={(e) => setHeroTitleInput(e.target.value)}
                        disabled={updatingTextConfig}
                        placeholder="e.g. Best Bridal Makeup Studio Ujjain & Indore"
                        className="w-full bg-neutral-950/60 text-white border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary font-sans transition-all"
                      />
                    </div>

                    {/* About Story */}
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-300 uppercase tracking-widest mb-2 font-sans">
                        About Story Text *
                      </label>
                      <textarea 
                        required
                        rows={8}
                        value={aboutStoryInput}
                        onChange={(e) => setAboutStoryInput(e.target.value)}
                        disabled={updatingTextConfig}
                        placeholder="Provide details about the salon story, achievements, and standard of care..."
                        className="w-full bg-neutral-950/60 text-white border border-neutral-800 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary font-sans transition-all resize-none leading-relaxed"
                      />
                    </div>

                    {/* Feedback Messages */}
                    {textConfigError && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2.5 bg-rose-500/10 text-rose-400 text-xs p-4 rounded-2xl border border-rose-500/20 font-sans"
                      >
                        <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                        <p>{textConfigError}</p>
                      </motion.div>
                    )}

                    {textConfigSuccess && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 text-xs p-4 rounded-2xl border border-emerald-500/20 font-sans"
                      >
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                        <p className="font-bold">Settings updated successfully!</p>
                      </motion.div>
                    )}

                    {/* Submit Buttons */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={updatingTextConfig}
                        className="w-full bg-brand-primary text-white py-3.5 rounded-2xl font-sans text-xs font-bold hover:bg-brand-primary/95 transition-all shadow-lg hover:shadow-brand-primary/10 flex items-center justify-center space-x-2 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
                      >
                        {updatingTextConfig ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                            <span>Saving Settings...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            <span>Save Settings</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* RIGHT COLUMN: Manage Current Looks (List/Grid with delete options) */}
            <div className="lg:col-span-7 bg-neutral-900/40 border border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col min-h-[500px]">
              <div className="mb-6 flex justify-between items-center text-left">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-white mb-1 flex items-center gap-2">
                    <ImageIcon className="h-5.5 w-5.5 text-brand-purple" />
                    <span>Manage Gallery</span>
                  </h2>
                  <p className="text-xs text-neutral-400 font-sans">
                    View, filter, and delete custom uploaded portfolio looks.
                  </p>
                </div>
              </div>

              {isLoadingGallery ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
                  <p className="text-xs text-neutral-400 font-sans mt-3">Fetching gallery database...</p>
                </div>
              ) : dynamicImages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 border border-dashed border-neutral-800 rounded-2xl">
                  <ImageIcon className="h-10 w-10 text-neutral-600 mb-3" />
                  <p className="text-sm font-bold text-neutral-400 font-serif">No Custom Images Found</p>
                  <p className="text-xs text-neutral-500 font-sans mt-1">Looks posted via the form will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1">
                  {dynamicImages.map((img) => (
                    <div 
                      key={img.id}
                      className="bg-neutral-900/80 border border-neutral-800/60 rounded-2xl p-4 flex gap-4 hover:border-neutral-700/60 transition-all group"
                    >
                      {/* Image Preview thumbnail */}
                      <div className="h-20 w-20 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800 relative">
                        <img 
                          src={img.url} 
                          alt={img.title} 
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Content details */}
                      <div className="flex-1 min-w-0 text-left flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-serif text-base font-bold text-neutral-200 truncate max-w-[280px]">
                              {img.title}
                            </h3>
                            <span className="bg-neutral-850 text-neutral-400 font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-neutral-800">
                              {img.category}
                            </span>
                            {img.isPreset && (
                              <span className="bg-brand-primary/10 text-brand-primary font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-brand-primary/20">
                                Preset
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 font-sans mt-1 line-clamp-2 leading-relaxed">
                            {img.description}
                          </p>
                        </div>

                        <div className="text-[10px] text-neutral-500 font-sans flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/40">
                          <span>
                            {img.createdAt ? new Date(img.createdAt?.seconds ? img.createdAt.seconds * 1000 : img.createdAt).toLocaleDateString() : 'Active'}
                          </span>
                          
                          <button
                            onClick={() => img.id && handleDeleteImage(img.id)}
                            className="text-neutral-500 hover:text-rose-400 flex items-center space-x-1 transition-colors hover:scale-105 active:scale-95 py-0.5 px-2 rounded bg-neutral-950/30 border border-neutral-800/40 hover:border-rose-500/20 cursor-pointer"
                            title="Delete Look"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="text-[9px] font-bold">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
