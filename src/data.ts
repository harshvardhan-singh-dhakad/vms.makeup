import { ServiceCategory, Review } from './types';
import galleryImg1 from './assets/images/regenerated_image_1784134583107.jpg';
import galleryImg2 from './assets/images/regenerated_image_1784134579911.jpg';
import galleryImg3 from './assets/images/regenerated_image_1784134587652.jpg';
import galleryImg4 from './assets/images/regenerated_image_1784136688341.jpg';
import galleryImg5 from './assets/images/regenerated_image_1784135367248.jpg';
import celestialGownImg from './assets/images/celestial_evening_gown.jpg';
import silverCoinBraidImg from './assets/images/traditional_silver_coin_braid.jpg';
import crimsonEmeraldGlowImg from './assets/images/royal_crimson_emerald_glow.jpg';

import categoryMakeupImg from './assets/images/category_makeup.jpg';
import categoryHairStylingImg from './assets/images/category_hair_styling.jpg';
import categoryHairTextureImg from './assets/images/category_hair_texture.jpg';
import categoryHairTreatmentsImg from './assets/images/category_hair_treatments.jpg';
import categoryFacialsImg from './assets/images/category_facials.jpg';
import categoryHandFeetImg from './assets/images/category_hand_feet.jpg';
import categoryNailsImg from './assets/images/category_nails.jpg';

export const SALON_INFO = {
  name: "Vms Makeup",
  tagline: "Your Neighbourhood Salon with a 5-Star Spa Experience",
  contactNumber: "", // Removed for now as requested
  whatsappNumber: "+919876543210", // Indore/Ujjain main contact
  address: "Ujjain",
  locationName: "Freegunj, Ujjain",
  hours: {
    weekdays: "10:30 AM - 08:30 PM",
    weekends: "10:00 AM - 09:00 PM",
    note: "Bridal Appointments can be scheduled earlier on request"
  },
  establishedYear: 2022, // 4 years in business as of 2026
  aboutStory: "Founded in 2022, Vms Makeup has built an unmatched reputation in Indore and Ujjain as a premium, women-first luxury sanctuary. We blend the welcoming, friendly warmth of a local neighbourhood salon with the flawless, world-class expertise of a 5-star spa. Guided by a passion for celebrating individual beauty, our professional team specializes in custom bridal makeovers, advanced clinical skincare, elite hair contouring, and modern nail aesthetics. We believe every woman deserves a tailored, pampering escape that leaves her feeling deeply rejuvenated and confidently beautiful."
};

export const SERVICES_DATA: ServiceCategory[] = [
  {
    id: "makeup",
    name: "Make Up",
    iconName: "Sparkles",
    imageUrl: categoryMakeupImg,
    description: "Our hallmark service. Flawless, luminous artistry tailored for your high-intent events.",
    items: [
      {
        id: "mu-1",
        name: "Bridal & Reception Make Up",
        category: "Make Up",
        description: "Includes high-definition luxury makeup, hair styling, outfit draping, and customized skin prep. Designed to look breathtaking in photos and live.",
        price: "Price on request",
        isPremium: true,
        iconName: "Crown"
      },
      {
        id: "mu-2",
        name: "Engagement Make Up",
        category: "Make Up",
        description: "Elegant, glowing look tailored to your outfit theme, highlighting natural features with a professional hair set and draping.",
        price: "Price on request",
        isPremium: true,
        iconName: "Diamond"
      },
      {
        id: "mu-3",
        name: "Party Make Up",
        category: "Make Up",
        description: "Sophisticated, lightweight look for festive parties, wedding guests, or corporate galas. Quick setup with high-impact results.",
        price: "Price on request",
        isPremium: false,
        iconName: "PartyPopper"
      },
      {
        id: "mu-4",
        name: "Custom Service Slot (Client to Fill)",
        category: "Make Up",
        description: "Reserved slot for customizable makeup requests (e.g., Sangeet special, Haldi/Mehendi look).",
        price: "Price on request",
        isPremium: false,
        iconName: "Wand2"
      },
      {
        id: "mu-5",
        name: "Custom Service Slot (Client to Fill)",
        category: "Make Up",
        description: "Reserved slot for customizable makeup requests (e.g., HD airbrush upgrade, bridesmaid package).",
        price: "Price on request",
        isPremium: false,
        iconName: "Sparkles"
      }
    ]
  },
  {
    id: "hair-styling",
    name: "Hair Styling",
    iconName: "Scissors",
    imageUrl: categoryHairStylingImg,
    description: "Transformative styling, cuts, and coloring for everyday styling or majestic events.",
    items: [
      { id: "hs-1", name: "Hair Cut", category: "Hair Styling", description: "Precision layering, chic bobs, or split-end cleanup with relaxing hair wash.", price: "Price on request", iconName: "Scissors" },
      { id: "hs-2", name: "Ironing", category: "Hair Styling", description: "Ultra-sleek, glossy straight hair setting using high-end safe heat protectors.", price: "Price on request", iconName: "Zap" },
      { id: "hs-3", name: "Global Colouring", category: "Hair Styling", description: "Full coverage premium ammonia-free hair color matching your undertone.", price: "Price on request", isPremium: true, iconName: "Palette" },
      { id: "hs-4", name: "Blow Dry", category: "Hair Styling", description: "Bouncy, red-carpet-ready volume and shine with professional styling tools.", price: "Price on request", iconName: "Wind" },
      { id: "hs-5", name: "Root Touch Up", category: "Hair Styling", description: "Quick, flawless root coverage matching your existing hair shade.", price: "Price on request", iconName: "Brush" },
      { id: "hs-6", name: "Shampoo & Conditioning", category: "Hair Styling", description: "Gentle cleanse and deep nourishment using luxury salon hair care lines.", price: "Price on request", iconName: "Droplets" },
      { id: "hs-7", name: "Head Massage", category: "Hair Styling", description: "Stress-relieving pressure-point massage with organic warm oils to promote circulation.", price: "Price on request", iconName: "Smile" },
      { id: "hs-8", name: "Roller Setting", category: "Hair Styling", description: "Classic retro curls and voluminous waves that last all evening.", price: "Price on request", iconName: "Circle" },
      { id: "hs-9", name: "Oiling", category: "Hair Styling", description: "Traditional deep oiling and scalp treatment for strengthening hair follicles.", price: "Price on request", iconName: "Droplet" }
    ]
  },
  {
    id: "hair-texture",
    name: "Hair Texture",
    iconName: "Flame",
    imageUrl: categoryHairTextureImg,
    description: "Premium texture alteration services to make your hair smooth, silky, and easy to manage.",
    items: [
      { id: "ht-1", name: "Keratin Treatment", category: "Hair Texture", description: "Rebuilds damaged protein structures, removing 90% frizz and adding brilliant shine.", price: "Price on request", isPremium: true, iconName: "Shield" },
      { id: "ht-2", name: "Smoothening", category: "Hair Texture", description: "Achieve silk-smooth, manageable hair with natural fall and incredible softness.", price: "Price on request", isPremium: true, iconName: "Feather" },
      { id: "ht-3", name: "Rebonding", category: "Hair Texture", description: "Permanent hair straightening treatment for perfectly straight and glossy locks.", price: "Price on request", isPremium: true, iconName: "Link" },
      { id: "ht-4", name: "Custom Service Slot (Client to Fill)", category: "Hair Texture", description: "Reserved slot for customizable hair texture treatment (e.g., Cysteine, Botox treatment).", price: "Price on request", iconName: "Wand2" }
    ]
  },
  {
    id: "hair-treatments",
    name: "Hair Treatments",
    iconName: "HeartPulse",
    imageUrl: categoryHairTreatmentsImg,
    description: "Targeted solutions to restore scalp health, stimulate growth, and lock in moisture.",
    items: [
      { id: "hm-1", name: "Spa Treatments", category: "Hair Treatments", description: "Deep conditioning steam spa tailored for oily, dry, or dandruff-prone scalps.", price: "Price on request", iconName: "Flower2" },
      { id: "hm-2", name: "Advanced Hair Moisturising", category: "Hair Treatments", description: "Intense moisture infusion therapy for dry, chemically treated, or brittle hair.", price: "Price on request", isPremium: true, iconName: "Droplets" },
      { id: "hm-3", name: "Scalp Treatments", category: "Hair Treatments", description: "Clinical clarifying therapy to fight dandruff, scalp itchiness, and seasonal hair fall.", price: "Price on request", iconName: "Activity" },
      { id: "hm-4", name: "Custom Service Slot (Client to Fill)", category: "Hair Treatments", description: "Reserved slot for advanced clinical hair scalp treatment (e.g., peptide infusion, plex repair).", price: "Price on request", iconName: "Stethoscope" }
    ]
  },
  {
    id: "facials",
    name: "Facials & Rituals",
    iconName: "Sparkle",
    imageUrl: categoryFacialsImg,
    description: "Indulgent skin rituals designed for radiant bridal glow and deep cellular rejuvenation.",
    items: [
      { id: "fr-1", name: "Luxury Facials/Rituals", category: "Facials & Rituals", description: "Premium, multi-step facial utilizing imported botanical serums and anti-aging gold therapies.", price: "Price on request", isPremium: true, iconName: "Sparkles" },
      { id: "fr-2", name: "Clean Ups", category: "Facials & Rituals", description: "Exfoliating and hydrating cleanup targeting blackheads, excess oil, and city pollution.", price: "Price on request", iconName: "Droplets" },
      { id: "fr-3", name: "Body Polishing", category: "Facials & Rituals", description: "Full body exfoliation, gentle cream massage, and skin brightener pack for ultimate glow.", price: "Price on request", isPremium: true, iconName: "Star" },
      { id: "fr-4", name: "Bleach", category: "Facials & Rituals", description: "Instantly brightens skin complexion and lightens fine facial hair with cooling care.", price: "Price on request", iconName: "Sun" },
      { id: "fr-5", name: "Threading", category: "Facials & Rituals", description: "Precision eyebrow shaping, forehead, upper-lip, or full face threading.", price: "Price on request", iconName: "Scissors" }
    ]
  },
  {
    id: "hand-feet",
    name: "Hand & Feet",
    iconName: "Hand",
    imageUrl: categoryHandFeetImg,
    description: "Pamper your extremities with clean, nourishing skin-smoothing rituals.",
    items: [
      { id: "hf-1", name: "Spa Manicure", category: "Hand & Feet", description: "Luxury hands scrub, deep mask, massage, cuticle care, and gorgeous nail grooming.", price: "Price on request", iconName: "Hand" },
      { id: "hf-2", name: "Spa Pedicure", category: "Hand & Feet", description: "Relaxing foot soak, scrub, organic cream massage, nail shaping, and deep hydration.", price: "Price on request", isPremium: true, iconName: "Footprints" },
      { id: "hf-3", name: "Manicure", category: "Hand & Feet", description: "Classic nail trimming, shaping, filing, cuticle cleanup, and nourishing massage.", price: "Price on request", iconName: "Hand" },
      { id: "hf-4", name: "Pedicure", category: "Hand & Feet", description: "Refreshing foot cleaning, heel scrubbing, and classic nail grooming.", price: "Price on request", iconName: "Footprints" },
      { id: "hf-5", name: "Waxing", category: "Hand & Feet", description: "Smooth waxing using premium honey or chocolate wax for glowing, hair-free skin.", price: "Price on request", iconName: "Flame" }
    ]
  },
  {
    id: "nails",
    name: "Nail Services",
    iconName: "Feather",
    imageUrl: categoryNailsImg,
    description: "Express your style with elite gel extensions, chrome finishes, and intricate nail art.",
    items: [
      { id: "ns-1", name: "Gel Extension", category: "Nail Services", description: "Long-lasting premium gel tips with customized length and shaping.", price: "Price on request", isPremium: true, iconName: "Layers" },
      { id: "ns-2", name: "Acrylic Extension", category: "Nail Services", description: "High-strength acrylic nail sculpts for an ultra-glamorous, sturdy look.", price: "Price on request", isPremium: true, iconName: "Shield" },
      { id: "ns-3", name: "Gel Overlay", category: "Nail Services", description: "Reinforce and shine your natural nails with a protective, clear gel layer.", price: "Price on request", iconName: "Droplet" },
      { id: "ns-4", name: "Gel Paint", category: "Nail Services", description: "Flawless, glossy, chip-resistant gel polish cured under UV light.", price: "Price on request", iconName: "Palette" },
      { id: "ns-5", name: "Chrome", category: "Nail Services", description: "Metallic mirror-like reflective finish applied over your favorite base gel color.", price: "Price on request", iconName: "Sun" },
      { id: "ns-6", name: "Ombre", category: "Nail Services", description: "Beautiful, smooth dual-tone gradient transition from light to dark.", price: "Price on request", iconName: "Palette" },
      { id: "ns-7", name: "Reflecting Glitter", category: "Nail Services", description: "Dazzling micro-glitter coat that sparkles brilliantly under direct light.", price: "Price on request", iconName: "Sparkles" },
      { id: "ns-8", name: "Cat Eye | 9D", category: "Nail Services", description: "Mystical, holographic magnetic gel look mimicking precious gemstones.", price: "Price on request", isPremium: true, iconName: "Eye" },
      { id: "ns-9", name: "Millers Work", category: "Nail Services", description: "Intricate modern nail embellishment including micro-beads and precision studs.", price: "Price on request", iconName: "Star" },
      { id: "ns-10", name: "French Tips / French Base (Nude)", category: "Nail Services", description: "Classic white tips or subtle elegant nude base for a clean, timeless look.", price: "Price on request", iconName: "Check" },
      { id: "ns-11", name: "Refilling & Refitting", category: "Nail Services", description: "In-fill gel/acrylic maintenance to extend the life of your extensions.", price: "Price on request", iconName: "RotateCcw" },
      { id: "ns-12", name: "Removal", category: "Nail Services", description: "Safe, chemical-free nail extension removal ensuring zero damage to natural nails.", price: "Price on request", iconName: "Trash2" }
    ]
  }
];

export const GALLERY_IMAGES = [
  {
    title: "Crimson Royalty Bridal Glow",
    category: "makeup",
    url: galleryImg1,
    description: "Deep traditional crimson lehenga look featuring flawless radiant airbrush finish, gold eyeshadow accents, and heavy kundan jewelry setting."
  },
  {
    title: "Empress Royal Hair Braid",
    category: "hair",
    url: galleryImg2,
    description: "An intricate traditional thick braid embellished with premium gold/silver chotli ornaments, side chains, and decorative mini jhumkas."
  },
  {
    title: "Elite 3D Blossom Nail Art",
    category: "nails",
    url: galleryImg3,
    description: "Artistic nude gel overlay adorned with delicate hand-crafted 3D white flowers, gold-leaf vines, and hand-placed premium rhinestones with checkered sleeves in background."
  },
  {
    title: "Classic Magenta Bridal Glow",
    category: "makeup",
    url: galleryImg4,
    description: "Exquisite bridal glow featuring a deep magenta-crimson lehenga, radiant skin prep, a heavy silver choker necklace with green emerald beads, and gold eyeshadow accents."
  },
  {
    title: "Rajputana Ivory Royal Glow",
    category: "makeup",
    url: galleryImg5,
    description: "A breathtaking traditional Rajputana makeup look featuring serene ivory-white ethnic wear, pristine base prep, elegant gold contours, and a heavy emerald-accented choker necklace."
  },
  {
    title: "Royal 3D Blossom Extension",
    category: "nails",
    url: "https://image.pollinations.ai/prompt/Close-up-photograph-of-a-woman-hand-showing-gorgeous-manicure-french-style-nude-base-with-3D-white-flower-petals-and-delicate-gold-foil-leaf-vines-wearing-a-red-bracelet-on-the-wrist-glossy-gel-finish?width=800&height=1000&nologo=true",
    description: "Nude gel overlays designed with beautiful white 3D floral petals and elegant hand-detailed gold foil stems, matching a traditional red thread wristband."
  },
  {
    title: "Traditional Imperial Braid",
    category: "hair",
    url: "https://image.pollinations.ai/prompt/Back-view-of-thick-long-black-hair-braid-styled-for-Indian-bride-decorated-with-traditional-circular-gold-jewelry-ornaments-and-bell-shaped-jhumka-accessories-cream-dress-wooden-door-background?width=800&height=1000&nologo=true",
    description: "Classic bridal long thick black braid embellished with elegant circular gold ornament chains, side decorative pins, and beautiful mini gold jhumkas."
  },
  {
    title: "Glamorous Celestial Evening Gown Look",
    category: "makeup",
    url: celestialGownImg,
    description: "Engagement and reception look featuring a sparkling sky-blue-teal gown with custom 3D floral accents, a refined gold chain, and mehndi-patterned hands under starry bubble lights."
  },
  {
    title: "Royal Crimson Emerald Bridal Glow",
    category: "makeup",
    url: crimsonEmeraldGlowImg,
    description: "Classic crimson bridal makeup look with an intricate gold-threaded lehenga, matched with a luxurious green emerald choker necklace, soft lip colors, and side-profile warm smile."
  },
  {
    title: "Traditional Silver Coin Braided Hair",
    category: "hair",
    url: silverCoinBraidImg,
    description: "Exquisite back profile of structured dark braided hair detailed with heavy circular silver coin-shaped chotli ornaments, delicate hanging mini chains, and mini jhumka accessories."
  }
];

export const REVIEWS_DATA: Review[] = [
  {
    id: "rev-1",
    name: "Anjali Sharma",
    rating: 5,
    date: "2 weeks ago",
    comment: "I booked Vms Makeup for my engagement look and they did an absolutely fantastic job! The makeup was flawless, not cakey at all, and lasted all night. Highly recommend their services for brides in Indore!",
    isReal: false,
    avatarSeed: "anjali"
  },
  {
    id: "rev-2",
    name: "Priyanka Patel",
    rating: 5,
    date: "1 month ago",
    comment: "Excellent service! Their Gel Nail Extension and Cat Eye art are the best in Scheme 54 Indore. The staff is extremely professional, polite, and they treat you like royalty. The ivory salon setup is beautiful.",
    isReal: false,
    avatarSeed: "priyanka"
  },
  {
    id: "rev-3",
    name: "Kirti Mandloi",
    rating: 5,
    date: "3 weeks ago",
    comment: "Best hair smoothing and keratin treatment in MP! I have tried multiple places in Indore and Ujjain but Vms Makeup has the most gentle and effective hair stylists. My hair feels incredibly silky.",
    isReal: false,
    avatarSeed: "kirti"
  },
  {
    id: "rev-4",
    name: "Sneha Vyas",
    rating: 5,
    date: "2 months ago",
    comment: "Their Luxury Gold Facial is pure heaven. Truly a 5-star spa experience in a lovely local neighbourhood setting. The rates are very reasonable for the quality they provide.",
    isReal: false,
    avatarSeed: "sneha"
  }
];
