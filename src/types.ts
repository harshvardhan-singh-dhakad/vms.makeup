export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  price?: string; // "Price on request via WhatsApp" or specific
  isPremium?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  items: ServiceItem[];
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  isReal?: boolean;
  avatarSeed: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ConsultationState {
  eventType: string;
  skinType: string;
  hairLength: string;
  outfitColor: string;
  hairConcern: string;
  additionalInfo: string;
}
