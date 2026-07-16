import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2, MessageCircle, RefreshCw, Copy, Check, ChevronRight, MessageSquare, Info, ShieldAlert } from 'lucide-react';
import { SALON_INFO } from '../data';

interface AIConsultantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIConsultant({ isOpen, onClose }: AIConsultantProps) {
  const [activeTab, setActiveTab] = useState<'planner' | 'chat'>('planner');
  
  // Itinerary Planner Form state
  const [eventType, setEventType] = useState('Bridal & Reception');
  const [skinType, setSkinType] = useState('Normal');
  const [hairLength, setHairLength] = useState('Medium');
  const [outfitColor, setOutfitColor] = useState('Traditional Maroon/Red');
  const [hairConcern, setHairConcern] = useState('None');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const [plannerResult, setPlannerResult] = useState('');
  const [loadingPlanner, setLoadingPlanner] = useState(false);
  const [copiedPlanner, setCopiedPlanner] = useState(false);

  // Live Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'model'; text: string }>>([
    {
      role: 'model',
      text: "Namaste! I am Vaanya, your personal AI Bridal & Look Consultant at Vms Makeup. Whether you are finalizing your wedding day glow, selecting the perfect nail overlay, or curing winter hair frizz, I am here to assist. Ask me anything about our services or try our customized Beauty Plan Builder!"
    }
  ]);
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loadingChat]);

  if (!isOpen) return null;

  // Handle building the beauty plan
  const handleBuildPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPlanner(true);
    setPlannerResult('');
    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          skinType,
          hairLength,
          outfitColor,
          hairConcern,
          additionalInfo
        })
      });
      const data = await response.json();
      if (data.error) {
        setPlannerResult(`Error: ${data.error}`);
      } else {
        setPlannerResult(data.result);
      }
    } catch (err: any) {
      setPlannerResult("Apologies! Our AI assistant is currently preparing skincare formulas. Please reach out over WhatsApp or retry.");
    } finally {
      setLoadingPlanner(false);
    }
  };

  // Handle sending chat messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loadingChat) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setLoadingChat(true);

    try {
      const updatedMessages = [...chatMessages, { role: 'user', text: userText }];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });
      const data = await response.json();
      if (data.error) {
        setChatMessages(prev => [...prev, { role: 'model', text: `Sorry, I encountered an error: ${data.error}` }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'model', text: data.reply }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Apologies! I seem to have lost connection to our styling handbook. Please drop a WhatsApp or retry shortly." }]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleCopyPlanner = () => {
    navigator.clipboard.writeText(plannerResult);
    setCopiedPlanner(true);
    setTimeout(() => setCopiedPlanner(false), 2000);
  };

  // Pre-fill WhatsApp with generated Itinerary
  const handleWhatsAppPlanner = () => {
    const text = `Hi Vmsmakeup! I generated a personalized look itinerary with your AI assistant for my upcoming ${eventType} event. Here is my outline:\n\n*Skin Type*: ${skinType}\n*Outfit Color*: ${outfitColor}\n*Hair Concern*: ${hairConcern}\n\nI would love to book a personal consultation with your human experts. Please guide me!`;
    return `https://wa.me/${SALON_INFO.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div 
      id="ai-consultant-overlay"
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        id="ai-consultant-sidebar"
        className="w-full max-w-2xl h-full bg-brand-bg-primary flex flex-col justify-between shadow-2xl relative border-l border-brand-secondary/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-bg-secondary border-b border-brand-secondary/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-full bg-brand-primary flex items-center justify-center text-brand-bg-primary border border-brand-gold/30">
              <Sparkles className="h-4.5 w-4.5 text-brand-gold" />
            </div>
            <div className="text-left">
              <h3 className="font-serif text-lg font-bold text-brand-primary flex items-center gap-1.5">
                AI Beauty Consultant
              </h3>
              <p className="text-[10px] text-brand-text-muted font-sans font-medium uppercase tracking-wider">
                Powered by Vaanya at Vmsmakeup
              </p>
            </div>
          </div>
          <button 
            id="close-ai-consultant"
            onClick={onClose}
            className="text-brand-text-muted hover:text-brand-primary font-sans text-sm font-semibold p-1 hover:bg-brand-primary/5 rounded-lg"
          >
            Close
          </button>
        </div>

        {/* Toggles */}
        <div className="flex bg-brand-bg-secondary border-b border-brand-secondary/15 px-6 py-2.5">
          <button
            id="toggle-planner-tab"
            onClick={() => setActiveTab('planner')}
            className={`flex-1 py-2 text-center font-sans text-xs font-semibold tracking-wider uppercase rounded-lg transition-all ${
              activeTab === 'planner'
                ? 'bg-brand-primary text-brand-bg-primary shadow-sm'
                : 'text-brand-text-muted hover:text-brand-primary'
            }`}
          >
            1. Beauty Plan Builder
          </button>
          <button
            id="toggle-chat-tab"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 text-center font-sans text-xs font-semibold tracking-wider uppercase rounded-lg transition-all ${
              activeTab === 'chat'
                ? 'bg-brand-primary text-brand-bg-primary shadow-sm'
                : 'text-brand-text-muted hover:text-brand-primary'
            }`}
          >
            2. Live Style Chat
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          
          {activeTab === 'planner' ? (
            <div className="space-y-6">
              
              {!plannerResult ? (
                <form onSubmit={handleBuildPlan} className="space-y-4">
                  <div className="text-left bg-brand-primary/5 border border-brand-primary/10 rounded-xl p-3.5 flex items-start space-x-2.5">
                    <Info className="h-5 w-5 text-brand-secondary mt-0.5 shrink-0" />
                    <p className="text-[11px] text-brand-text-muted font-sans leading-relaxed">
                      Answer 5 quick details about your celebration to let Vaanya compile a bespoke skincare prep schedule, hair look, and official service recommendations!
                    </p>
                  </div>

                  {/* Event Type */}
                  <div className="text-left">
                    <label className="block text-xs font-bold text-brand-primary uppercase tracking-wide mb-1.5">
                      1. Celebration / Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-brand-bg-secondary border border-brand-secondary/20 rounded-xl px-4 py-2.5 font-sans text-xs text-brand-text-dark focus:outline-none focus:border-brand-primary"
                    >
                      <option value="Bridal & Reception">Bridal & Reception (Main Wedding Day)</option>
                      <option value="Engagement Ceremony">Engagement Ceremony / Roka</option>
                      <option value="Sangeet & Haldi">Sangeet, Haldi & Mehendi Festival</option>
                      <option value="Party Special">Party / Guest Make-up look</option>
                      <option value="Festive Glow">Traditional Festival (Diwali/Karwa Chauth)</option>
                    </select>
                  </div>

                  {/* Skin Type */}
                  <div className="text-left">
                    <label className="block text-xs font-bold text-brand-primary uppercase tracking-wide mb-1.5">
                      2. Your Skin Profile
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Dry', 'Oily', 'Combination', 'Sensitive', 'Normal'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setSkinType(type)}
                          className={`py-2 rounded-lg font-sans text-xs font-medium transition-all ${
                            skinType === type
                              ? 'bg-brand-primary/10 text-brand-primary border-2 border-brand-primary'
                              : 'bg-brand-bg-secondary border border-brand-secondary/15 text-brand-text-muted'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outfit Color */}
                  <div className="text-left">
                    <label className="block text-xs font-bold text-brand-primary uppercase tracking-wide mb-1.5">
                      3. Outfit Shade / Theme
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Velvet Crimson Red, Pastel Pink, Emerald Green"
                      value={outfitColor}
                      onChange={(e) => setOutfitColor(e.target.value)}
                      className="w-full bg-brand-bg-secondary border border-brand-secondary/20 rounded-xl px-4 py-2.5 font-sans text-xs text-brand-text-dark placeholder-brand-text-muted focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  {/* Hair Profile & Concern */}
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-brand-primary uppercase tracking-wide mb-1.5">
                        4. Hair Length
                      </label>
                      <select
                        value={hairLength}
                        onChange={(e) => setHairLength(e.target.value)}
                        className="w-full bg-brand-bg-secondary border border-brand-secondary/20 rounded-xl px-4 py-2.5 font-sans text-xs text-brand-text-dark focus:outline-none focus:border-brand-primary"
                      >
                        <option value="Short">Short (Above shoulder)</option>
                        <option value="Medium">Medium (Shoulder to back)</option>
                        <option value="Long">Long (Lower back)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-brand-primary uppercase tracking-wide mb-1.5">
                        5. Primary Hair Concern
                      </label>
                      <select
                        value={hairConcern}
                        onChange={(e) => setHairConcern(e.target.value)}
                        className="w-full bg-brand-bg-secondary border border-brand-secondary/20 rounded-xl px-4 py-2.5 font-sans text-xs text-brand-text-dark focus:outline-none focus:border-brand-primary"
                      >
                        <option value="None">None (Healthy)</option>
                        <option value="Dry & Frizzy">Dry & Frizzy</option>
                        <option value="Dandruff / Itchiness">Dandruff / Itchiness</option>
                        <option value="Thinning / Hair Fall">Thinning / Hair Fall</option>
                        <option value="Chemically Damaged">Chemically Damaged</option>
                      </select>
                    </div>
                  </div>

                  {/* Additional notes */}
                  <div className="text-left">
                    <label className="block text-xs font-bold text-brand-primary uppercase tracking-wide mb-1.5">
                      6. Custom Styling Preferences (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. I prefer subtle eyes and high glow skin, or heavy roller settings for curly hair texture."
                      value={additionalInfo}
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="w-full bg-brand-bg-secondary border border-brand-secondary/20 rounded-xl px-4 py-2.5 font-sans text-xs text-brand-text-dark placeholder-brand-text-muted focus:outline-none focus:border-brand-primary resize-none"
                    />
                  </div>

                  <button
                    id="submit-planner-btn"
                    type="submit"
                    disabled={loadingPlanner}
                    className="w-full flex items-center justify-center space-x-2 bg-brand-primary text-brand-bg-primary py-4 rounded-xl font-sans text-sm font-bold shadow-md hover:bg-brand-primary/95 transition-all cursor-pointer"
                  >
                    {loadingPlanner ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        <span>Consulting Vaanya's Stylist Manual...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4.5 w-4.5 text-brand-gold fill-brand-gold/30" />
                        <span>Create My Royal Itinerary</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-brand-secondary/20 pb-3">
                    <h4 className="font-serif text-lg font-bold text-brand-primary">Your Bespoke Look Itinerary</h4>
                    <button
                      id="reset-planner-btn"
                      onClick={() => setPlannerResult('')}
                      className="flex items-center space-x-1 font-sans text-[10px] font-bold text-brand-text-muted hover:text-brand-primary transition-colors"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Configure New Plan</span>
                    </button>
                  </div>

                  {/* Rendered itinerary box */}
                  <div className="bg-brand-bg-secondary border border-brand-secondary/15 rounded-2xl p-5 font-sans text-xs leading-relaxed text-brand-text-dark whitespace-pre-line max-h-[400px] overflow-y-auto">
                    {plannerResult}
                  </div>

                  {/* Actions for generated Itinerary */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <a
                      id="planner-whatsapp-book"
                      href={handleWhatsAppPlanner()}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center space-x-2 bg-brand-primary text-brand-bg-primary py-3 rounded-xl font-sans text-xs font-bold shadow-md hover:bg-brand-primary/95 transition-all"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Discuss with Human Stylist</span>
                    </a>
                    
                    <button
                      id="planner-copy-btn"
                      onClick={handleCopyPlanner}
                      className="px-5 py-3 rounded-xl border border-brand-primary/30 text-brand-primary font-sans text-xs font-bold hover:bg-brand-primary/5 flex items-center justify-center space-x-2"
                    >
                      {copiedPlanner ? (
                        <>
                          <Check className="h-4 w-4 text-brand-gold" />
                          <span>Copied Plan</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          ) : (
            /* LIVE CHAT INTERFACE */
            <div className="flex flex-col h-[480px] bg-brand-bg-secondary rounded-2xl border border-brand-secondary/15 overflow-hidden">
              {/* Messages container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-sans leading-relaxed text-left ${
                        msg.role === 'user' 
                          ? 'bg-brand-primary text-brand-bg-primary rounded-br-none shadow-sm' 
                          : 'bg-brand-bg-primary text-brand-text-dark border border-brand-secondary/10 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <span className="block font-sans text-[8px] uppercase tracking-wider mb-1 font-bold opacity-60">
                        {msg.role === 'user' ? 'You' : 'Vaanya • AI Stylist'}
                      </span>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {loadingChat && (
                  <div className="flex justify-start">
                    <div className="bg-brand-bg-primary text-brand-text-dark border border-brand-secondary/10 rounded-2xl p-3 rounded-bl-none shadow-sm flex items-center space-x-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-primary" />
                      <span className="font-sans text-[10px] text-brand-text-muted">Vaanya is analyzing services...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-brand-secondary/15 bg-brand-bg-primary flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Ask Vaanya about nail extensions, facials, hair smoothening..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={loadingChat}
                  className="flex-1 bg-brand-bg-secondary border border-brand-secondary/20 rounded-xl px-4 py-2.5 font-sans text-xs text-brand-text-dark placeholder-brand-text-muted focus:outline-none focus:border-brand-primary"
                />
                <button
                  id="send-chat-btn"
                  type="submit"
                  disabled={!chatInput.trim() || loadingChat}
                  className="bg-brand-primary text-brand-bg-primary p-2.5 rounded-xl hover:bg-brand-primary/95 transition-all disabled:opacity-50 cursor-pointer"
                  aria-label="Send Message"
                >
                  <Send className="h-4.5 w-4.5" />
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-brand-bg-secondary border-t border-brand-secondary/15 px-6 py-4 flex items-center justify-between text-[10px] text-brand-text-muted font-sans">
          <span>Your data remains safe & confidential.</span>
          <span className="font-semibold text-brand-primary">Vmsmakeup Studio © 2026</span>
        </div>
      </div>
    </div>
  );
}
