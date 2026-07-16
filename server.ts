import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini using @google/genai with correct server-side configuration
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.post("/api/consultation", async (req, res) => {
  try {
    const { eventType, skinType, hairLength, outfitColor, hairConcern, additionalInfo } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured in Secrets." });
    }

    const prompt = `You are 'Vaanya', the expert AI Bridal & Beauty Consultant for Vms Makeup Salon, Indore and Ujjain's premium 5-star beauty destination. Generate a luxury, personalized beauty itinerary for a client based on:
- Event: ${eventType}
- Skin Type: ${skinType}
- Hair Length: ${hairLength}
- Outfit Color: ${outfitColor}
- Hair Concern: ${hairConcern || "None"}
- Extra Notes: ${additionalInfo || "None"}

Please recommend specific services from our official menu:
- Hair Styling (Hair Cut, Ironing, Global Colouring, Blow Dry, Root Touch Up, Shampoo & Conditioning, Head Massage, Roller Setting, Oiling)
- Make Up (Party Make Up, Engagement Make Up, Bridal & Reception Make Up)
- Hair Texture (Rebonding, Keratin, Smoothening)
- Hair Treatments (Spa Treatments, Advanced Hair Moisturising, Scalp Treatments)
- Facials & Rituals (Bleach, Luxury Facials/Rituals, Clean Ups, Body Polishing, Threading)
- Hand & Feet (Manicure, Spa Pedicure, Pedicure, Waxing, Spa Manicure)
- Nail Services (Gel Paint, Removal, Refilling, Acrylic Extension, Gel Overlay, Gel Extension, French Tips, French Base (Nude), Chrome, Ombre, Reflecting Glitter, Cat Eye | 9D, Millers Work)

Provide the response in structured sections:
1. **The Vision**: Describe the perfect look (makeup, hair, nails) matching their outfit color and event.
2. **Recommended Beauty Schedule**: Timeline of sessions (e.g., '10 Days Before', '3 Days Before', 'On the Event Day').
3. **Menu Highlights**: A bulleted list of 4-6 specific services they must book from our menu.
4. **Professional Stylist Tips**: 2-3 warm, expert tips for their skin/hair type leading up to the event.

Ensure the tone is warm, highly professional, encouraging, and luxury-tier. Present it in a beautifully formatted Markdown layout. Keep it descriptive yet concise. Do not use any filler text or greetings at the beginning. Start directly with the vision.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const resultText = response.text || "Failed to generate your personalized bridal itinerary. Please reach out to our team over WhatsApp!";
    res.json({ result: resultText });
  } catch (error: any) {
    console.error("Consultation Generation Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during consultation generation." });
  }
});

// AI Chatbot endpoint for interactive advice
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body; // Array of { role: 'user' | 'model', text: string }
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured in Secrets." });
    }

    const formattedContents = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: `You are 'Vaanya', the welcoming, highly skilled AI Beauty Assistant for 'Vms Makeup', a premium 5-star salon based in Indore & Ujjain, MP, India.
We specialize in:
- Hair Styling: Hair Cut, Ironing, Global Colouring, Blow Dry, Root Touch Up, Shampoo & Conditioning, Head Massage, Roller Setting, Oiling
- Make Up: Party Make Up, Engagement Make Up, Bridal & Reception Make Up (our high-end specialty)
- Hair Texture: Rebonding, Keratin, Smoothening
- Hair Treatments: Spa Treatments, Advanced Hair Moisturising, Scalp Treatments
- Facials & Rituals: Bleach, Luxury Facials/Rituals, Clean Ups, Body Polishing, Threading
- Hand & Feet: Manicure, Spa Pedicure, Pedicure, Waxing, Spa Manicure
- Nail Services: Gel Paint, Removal, Refilling, Acrylic Extension, Gel Overlay, Gel Extension, French Tips, French Base (Nude), Chrome, Ombre, Reflecting Glitter, Cat Eye | 9D, Millers Work

Our brand tone is warm, elegant, upscale, and helpful. Always refer to our specific menu when helping. If they ask for prices, explain that pricing is available on request via WhatsApp, and encourage them to book by clicking our WhatsApp links. Keep responses short, concise, friendly, and focused on salon services. Encourage them to book!`,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during the AI chat interaction." });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
